
import React, { useState, useRef, useEffect, ReactNode, useContext, useCallback } from 'react';
import { AccordionContext } from './AccordionContext';

interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    isNested?: boolean;
    titleClassName?: string;
    wrapperClassName?: string;
    isOpenInitially?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isNested = false, titleClassName = "", wrapperClassName = "", isOpenInitially = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenInitially);
    const contentRef = useRef<HTMLDivElement>(null);
    const parentContext = useContext(AccordionContext);

    /**
     * Re-calculates and sets the maxHeight of the accordion's content area.
     * This is called by a child accordion when its size changes.
     */
    const updateHeight = useCallback(() => {
        // This timeout waits for the child's CSS transition to finish before this
        // parent measures its new scrollHeight. This duration MUST match the
        // transition duration in the CSS class 'duration-400'.
        setTimeout(() => {
            if (contentRef.current) {
                // Only change height if this parent is currently open.
                if (isOpen) {
                    contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
                }
                
                // After this accordion has potentially changed its size (because its child did),
                // it must notify its OWN parent to do the same. This creates the propagation chain.
                if (isNested) {
                    parentContext.onChildToggle();
                }
            }
        }, 400); // This duration must match the CSS transition duration.
    }, [isOpen, isNested, parentContext]);

    /**
     * Handles this accordion's own open/close animation.
     */
    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
            } else {
                contentRef.current.style.maxHeight = '0px';
            }
        }
    }, [isOpen]);

    /**
     * Handles the user clicking the accordion header to toggle it.
     */
    const toggleAccordion = () => {
        setIsOpen(prev => !prev);
        // Notify the direct parent that a layout shift is about to occur.
        if (isNested) {
            parentContext.onChildToggle();
        }
    };
    
    // The context value provided to children is this accordion's `updateHeight` function.
    const contextValue = { onChildToggle: updateHeight };

    return (
        <div className={`accordion-item ${wrapperClassName}`}>
            <button
                className={`accordion-header w-full flex items-center justify-between cursor-pointer transition-colors ${titleClassName}`}
                onClick={toggleAccordion}
                aria-expanded={isOpen}
            >
                {title}
                <span className={`material-symbols-outlined text-2xl text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpenInitially ? 'none' : '0px' }} // Allow initial open state to have full height without animation
                className="accordion-content overflow-hidden transition-all duration-400 ease-in-out"
                aria-hidden={!isOpen}
            >
                {/* The Provider makes the 'updateHeight' function available to all descendant components. */}
                <AccordionContext.Provider value={contextValue}>
                    {children}
                </AccordionContext.Provider>
            </div>
        </div>
    );
};

export default Accordion;