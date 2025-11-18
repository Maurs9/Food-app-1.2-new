import React, { useState } from 'react';
import { FoodTags } from '../types';
import { FILTER_OPTIONS } from '../constants';

interface FilterPanelProps {
    initialFilters: FoodTags;
    onApply: (newFilters: FoodTags) => void;
    onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ initialFilters, onApply, onReset }) => {
    const [currentFilters, setCurrentFilters] = useState<FoodTags>(initialFilters);

    const handleCheckboxChange = (category: keyof FoodTags, option: string) => {
        setCurrentFilters(prevFilters => {
            const currentCategoryFilters = prevFilters[category] || [];
            const newCategoryFilters = currentCategoryFilters.includes(option)
                ? currentCategoryFilters.filter(item => item !== option)
                : [...currentCategoryFilters, option];
            return {
                ...prevFilters,
                [category]: newCategoryFilters
            };
        });
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(FILTER_OPTIONS).map(([key, { label, options }]) => (
                    <div key={key}>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 border-b pb-2 dark:border-slate-600">{label}</h4>
                        <div className="space-y-2">
                            {options.map(option => (
                                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters[key as keyof FoodTags]?.includes(option) || false}
                                        onChange={() => handleCheckboxChange(key as keyof FoodTags, option)}
                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-sky-600 focus:ring-sky-500 bg-transparent dark:focus:ring-offset-slate-800"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={onReset}
                    className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
                >
                    Resetează
                </button>
                <button
                    onClick={() => onApply(currentFilters)}
                    className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                    Aplică Filtre
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;