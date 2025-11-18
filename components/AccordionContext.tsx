import React from 'react';

/**
 * Creates a context to allow nested Accordion components to communicate with their parents.
 * When a nested accordion is toggled, it can call the `onChildToggle` function provided
 * by its parent's context, signaling the parent to re-calculate its height to ensure
 * smooth animations for all nested content.
 */
export const AccordionContext = React.createContext<{
  onChildToggle: () => void;
}>({
  onChildToggle: () => {}, // Provide a no-op default function
});
