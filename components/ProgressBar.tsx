import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
    label: string;
    value: number;
    max: number;
    unit: string;
    color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, unit, color }) => {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Animate on mount or when percentage changes
        const timer = requestAnimationFrame(() => setWidth(percentage));
        return () => cancelAnimationFrame(timer);
    }, [percentage]);

    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {value.toFixed(0)} / {max} {unit}
                </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;