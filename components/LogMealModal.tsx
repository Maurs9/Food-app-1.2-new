import React, { useState, useEffect } from 'react';
import { MealNutrients } from '../types';
import { translations, Language } from '../translations';

interface LogMealModalProps {
    mealData: {
        photoBase64?: string;
        analysisText: string;
        nutrients: MealNutrients;
    };
    onClose: () => void;
    onSave: (meal: { photoBase64?: string; analysisText: string; nutrients: MealNutrients; }) => void;
    language: Language;
}

const LogMealModal: React.FC<LogMealModalProps> = ({ mealData, onClose, onSave, language }) => {
    const t = translations[language];
    const [analysisText, setAnalysisText] = useState(mealData.analysisText);
    const [nutrients, setNutrients] = useState(mealData.nutrients);

    useEffect(() => {
        setAnalysisText(mealData.analysisText);
        setNutrients(mealData.nutrients);
    }, [mealData]);

    const handleNutrientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNutrients(prev => ({ ...prev, [name]: Number(value) || 0 }));
    };

    const handleSave = () => {
        onSave({
            photoBase64: mealData.photoBase64,
            analysisText,
            nutrients
        });
    };

    const NutrientInput: React.FC<{ label: string; name: keyof MealNutrients; value: number; unit: string; }> = ({ label, name, value, unit }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <div className="relative mt-1">
                <input
                    type="number"
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleNutrientChange}
                    className="w-full pl-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{unit}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t.analyzer.logMealModalTitle}</h2>
                <div className="space-y-4">
                    {mealData.photoBase64 && (
                        <img src={`data:image/jpeg;base64,${mealData.photoBase64}`} alt="Meal" className="w-full h-48 object-cover rounded-lg mb-4" />
                    )}
                    <div>
                        <label htmlFor="analysisText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.analyzer.analysisNotes}</label>
                        <textarea
                            id="analysisText"
                            rows={4}
                            value={analysisText}
                            onChange={e => setAnalysisText(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-2">{t.analyzer.nutrients}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <NutrientInput label={t.profileModal.calories} name="calories" value={nutrients.calories} unit="kcal" />
                            <NutrientInput label={t.profileModal.protein} name="protein" value={nutrients.protein} unit="g" />
                            <NutrientInput label={t.profileModal.carbs} name="carbs" value={nutrients.carbs} unit="g" />
                            {/* FIX: Corrected typo in translation key from `fat` to `fats`. */}
                            <NutrientInput label={t.profileModal.fats} name="fat" value={nutrients.fat} unit="g" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors">{t.profileModal.cancel}</button>
                    <button onClick={handleSave} className="py-2 px-5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center">
                       <span className="material-symbols-outlined !text-base mr-1">add_task</span> {t.analyzer.logButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogMealModal;