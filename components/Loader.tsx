import React from 'react';

interface LoaderProps {
    text?: string;
    size?: string;
}

const Loader: React.FC<LoaderProps> = ({ text, size = "h-12 w-12" }) => {
    return (
        <div className="text-center my-8">
            <div className={`animate-spin rounded-full ${size} border-b-4 border-indigo-500 dark:border-indigo-400 mx-auto`}></div>
            {text && <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold text-lg">{text}</p>}
        </div>
    );
};

export default Loader;