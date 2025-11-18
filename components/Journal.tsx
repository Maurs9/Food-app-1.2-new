import React, { useState, useMemo } from 'react';
import { DailyLog, DietaryProfile, LoggedMeal } from '../types';
import MacroDonutChart from './MacroDonutChart';
import ProgressBar from './ProgressBar';

const parseMarkdown = (text: string | undefined | null) => {
    if (!text) return { __html: '' };
    return { __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') };
};

const Journal: React.FC<{ dailyLog: DailyLog; profile: DietaryProfile; }> = ({ dailyLog, profile }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const mealsForSelectedDate = useMemo(() => {
        return dailyLog[selectedDate] || [];
    }, [dailyLog, selectedDate]);

    const dailyTotals = useMemo(() => {
        return mealsForSelectedDate.reduce((acc, meal) => {
            acc.calories += meal.nutrients.calories || 0;
            acc.protein += meal.nutrients.protein || 0;
            acc.carbs += meal.nutrients.carbs || 0;
            acc.fat += meal.nutrients.fat || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [mealsForSelectedDate]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">Jurnal Alimentar</h2>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
                />
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Sumar {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                {mealsForSelectedDate.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <ProgressBar 
                                label="Calorii"
                                value={dailyTotals.calories}
                                max={profile.calorieGoal || 2000}
                                unit="kcal"
                                color="bg-gradient-to-r from-sky-500 to-indigo-500"
                            />
                             <ProgressBar 
                                label="Proteine"
                                value={dailyTotals.protein}
                                max={profile.proteinGoal || 100}
                                unit="g"
                                color="bg-gradient-to-r from-red-500 to-orange-500"
                            />
                             <ProgressBar 
                                label="Carbohidrați"
                                value={dailyTotals.carbs}
                                max={profile.carbGoal || 250}
                                unit="g"
                                color="bg-gradient-to-r from-amber-500 to-yellow-500"
                            />
                             <ProgressBar 
                                label="Grăsimi"
                                value={dailyTotals.fat}
                                max={profile.fatGoal || 70}
                                unit="g"
                                color="bg-gradient-to-r from-violet-500 to-purple-500"
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <MacroDonutChart 
                                protein={dailyTotals.protein}
                                carbs={dailyTotals.carbs}
                                fat={dailyTotals.fat}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nicio masă înregistrată pentru această zi.</p>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Mesele Zilei</h3>
                {mealsForSelectedDate.length > 0 ? (
                     [...mealsForSelectedDate].reverse().map((meal: LoggedMeal) => (
                        <div key={meal.id} className="flex sm:grid sm:grid-cols-3 items-center gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                            <div className="sm:col-span-1 flex-shrink-0">
                                {meal.photoBase64 ? (
                                    <img src={`data:image/jpeg;base64,${meal.photoBase64}`} alt="Meal" className="w-24 h-24 sm:w-full sm:h-40 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-24 h-24 sm:w-full sm:h-40 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-400 text-4xl">no_photography</span>
                                    </div>
                                )}
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{new Date(meal.timestamp).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</p>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={parseMarkdown(meal.analysisText)}></div>
                                <div className="text-xs pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-x-4 gap-y-1">
                                    <span className="font-semibold text-sky-700 dark:text-sky-400">Calorii: {meal.nutrients.calories}</span>
                                    <span className="font-semibold text-red-700 dark:text-red-400">Proteine: {meal.nutrients.protein}g</span>
                                    <span className="font-semibold text-amber-700 dark:text-amber-400">Carbs: {meal.nutrients.carbs}g</span>
                                    <span className="font-semibold text-violet-700 dark:text-violet-400">Grăsimi: {meal.nutrients.fat}g</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400">Adaugă prima masă din secțiunea "Analizor".</p>
                )}
            </div>
        </div>
    );
};

export default Journal;