
import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, DailyLog, DietaryProfile, WaterLog, ShoppingItem } from '../types';
import * as aiService from '../services/aiService';
import { translations, Language } from '../translations';
import Loader from './Loader';
import ProgressBar from './ProgressBar';

interface DashboardProps {
  dailyLog: DailyLog;
  waterLog: WaterLog;
  onAddWater: (amount: number) => void;
  profile: DietaryProfile;
  onTabChange: (tab: ActiveTab) => void;
  onProfileClick: () => void;
  language: Language;
  shoppingList: ShoppingItem[];
  onToggleShoppingItem: (id: string) => void;
  onAddShoppingItem: (name: string) => void;
  onRemoveShoppingItem: (id: string) => void;
}

const QuickAccessButton: React.FC<{ icon: string; title: string; onClick: () => void; className: string; }> = ({ icon, title, onClick, className }) => (
    <button 
        onClick={onClick} 
        className={`relative rounded-xl p-6 text-left text-white overflow-hidden transition-transform transform hover:scale-105 duration-300 group ${className}`}
    >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
        <div className="relative z-10 flex flex-col h-full">
            <span className="material-symbols-outlined text-4xl mb-auto">{icon}</span>
            <p className="font-bold text-lg">{title}</p>
        </div>
    </button>
);

const TipOfTheDay: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language].dashboard;

    const tip = useMemo(() => {
        const dayOfMonth = new Date().getDate();
        const tipIndex = (dayOfMonth - 1) % t.tipOfTheDayList.length;
        return t.tipOfTheDayList[tipIndex];
    }, [language, t.tipOfTheDayList]);
    
    return (
        <div className="card h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/50 border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3 flex items-center">
                <span className="material-symbols-outlined mr-3 text-amber-500">lightbulb</span>
                {t.tipOfTheDay}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 flex-grow">
                <p>{tip}</p>
            </div>
        </div>
    );
};

const MacroStat: React.FC<{ label: string, value: number, goal: number, unit: string }> = ({ label, value, goal, unit }) => (
    <div className="text-center sm:text-left">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value.toFixed(0)}<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/{goal}{unit}</span></p>
    </div>
);

const TodaySummary: React.FC<{ totals: { calories: number; protein: number; carbs: number; fat: number; }; profile: DietaryProfile; language: Language; }> = ({ totals, profile, language }) => {
    const t = translations[language].dashboard;

    return (
        <div className="card p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t.todaySummary}</h3>
            <div className="space-y-4">
                <ProgressBar
                    label="Calorii"
                    value={totals.calories}
                    max={profile.calorieGoal || 2000}
                    unit="kcal"
                    color="bg-gradient-to-r from-sky-500 to-indigo-500"
                />
                <div className="grid grid-cols-3 gap-4 pt-2">
                    <MacroStat label="Proteine" value={totals.protein} goal={profile.proteinGoal || 100} unit="g" />
                    <MacroStat label="Carbohidrați" value={totals.carbs} goal={profile.carbGoal || 250} unit="g" />
                    <MacroStat label="Grăsimi" value={totals.fat} goal={profile.fatGoal || 70} unit="g" />
                </div>
            </div>
        </div>
    );
};

const WaterTracker: React.FC<{ waterIntake: number, onAddWater: (amount: number) => void }> = ({ waterIntake, onAddWater }) => {
    const GOAL = 2000; // ml
    const GLASS_SIZE = 250; // ml
    const totalGlasses = Math.ceil(GOAL / GLASS_SIZE);
    const filledGlasses = Math.min(Math.floor(waterIntake / GLASS_SIZE), totalGlasses);
    const percentage = Math.min(Math.round((waterIntake / GOAL) * 100), 100);
    const isGoalReached = waterIntake >= GOAL;

    return (
        <div className={`card bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50 ${isGoalReached ? 'ring-2 ring-blue-400' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-blue-500">water_drop</span>
                    Hidratare
                </h3>
                <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{waterIntake}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400"> / {GOAL} ml</span>
                </div>
            </div>
            
            <div className="flex justify-between gap-2 mb-2">
                 {[...Array(totalGlasses)].map((_, index) => (
                     <div 
                        key={index} 
                        className={`h-12 flex-1 rounded-md transition-all duration-500 relative overflow-hidden bg-white dark:bg-slate-700 border border-blue-100 dark:border-slate-600 ${index < filledGlasses ? 'shadow-inner scale-105' : ''}`}
                    >
                        <div 
                            className={`absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500 ease-out ${index < filledGlasses ? 'h-full' : 'h-0'}`}
                        >
                             {index < filledGlasses && <div className="w-full h-full animate-pulse opacity-20 bg-white"></div>}
                        </div>
                     </div>
                 ))}
            </div>
            
            <p className="text-xs text-right text-blue-600 dark:text-blue-300 font-semibold mb-4">{percentage}% din obiectiv</p>

            {isGoalReached ? (
                <div className="w-full py-2 bg-green-500 text-white rounded-lg font-bold text-center shadow-md animate-pulse">
                    🎉 Obiectiv Atins!
                </div>
            ) : (
                <button 
                    onClick={() => onAddWater(GLASS_SIZE)}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-md active:scale-95 transform flex items-center justify-center"
                >
                    <span className="material-symbols-outlined mr-1">add</span>
                    Adaugă {GLASS_SIZE}ml
                </button>
            )}
        </div>
    );
}

const ShoppingListWidget: React.FC<{ 
    items: ShoppingItem[], 
    onToggle: (id: string) => void, 
    onAdd: (name: string) => void,
    onRemove: (id: string) => void,
    language: Language
}> = ({ items, onToggle, onAdd, onRemove, language }) => {
    const t = translations[language].dashboard;
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div className="card bg-white dark:bg-slate-800 h-full flex flex-col">
             <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <span className="material-symbols-outlined mr-2 text-emerald-500">shopping_cart</span>
                {t.shoppingList}
            </h3>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={t.addItem}
                    className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-sm"
                />
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg">
                    <span className="material-symbols-outlined !text-xl">add</span>
                </button>
            </form>
            <div className="flex-grow overflow-y-auto max-h-48 space-y-1">
                {items.length === 0 ? (
                    <p className="text-sm text-slate-400 italic text-center py-4">{t.noItems}</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg group">
                            <label className="flex items-center space-x-2 cursor-pointer flex-grow">
                                <input 
                                    type="checkbox" 
                                    checked={item.checked} 
                                    onChange={() => onToggle(item.id)} 
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className={`text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {item.name}
                                </span>
                            </label>
                            <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined !text-lg">close</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ dailyLog, waterLog, onAddWater, profile, onTabChange, onProfileClick, language, shoppingList, onToggleShoppingItem, onAddShoppingItem, onRemoveShoppingItem }) => {
  const t = translations[language].dashboard;

  const dailyTotals = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const mealsForToday = dailyLog[today] || [];
    return mealsForToday.reduce((acc, meal) => {
        acc.calories += meal.nutrients.calories || 0;
        acc.protein += meal.nutrients.protein || 0;
        acc.carbs += meal.nutrients.carbs || 0;
        acc.fat += meal.nutrients.fat || 0;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [dailyLog]);
  
  const todayWater = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return waterLog[today] || 0;
  }, [waterLog]);
  
  return (
    <div className="space-y-8">
      <div className="text-center pt-4">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{t.welcome}</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">{t.whatToDo}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaySummary totals={dailyTotals} profile={profile} language={language} />
          </div>
          <div className="lg:col-span-1">
            <WaterTracker waterIntake={todayWater} onAddWater={onAddWater} />
          </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4">{t.quickAccess}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{minHeight: '160px'}}>
            <QuickAccessButton 
                icon="barcode_scanner" 
                title={t.analyzeProduct}
                onClick={() => onTabChange('analyzer')}
                className="bg-gradient-to-br from-sky-500 to-indigo-600"
            />
             <QuickAccessButton 
                icon="restaurant" 
                title={t.exploreGuide}
                onClick={() => onTabChange('guide')}
                className="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
             <QuickAccessButton 
                icon="history_edu" 
                title={t.viewJournal}
                onClick={() => onTabChange('journal')}
                className="bg-gradient-to-br from-violet-500 to-purple-600"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ShoppingListWidget 
                items={shoppingList} 
                onToggle={onToggleShoppingItem} 
                onAdd={onAddShoppingItem} 
                onRemove={onRemoveShoppingItem}
                language={language}
            />
          </div>
          <div className="md:col-span-1">
              <TipOfTheDay language={language} />
          </div>
          <div className="md:col-span-1 card h-full flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3 flex items-center">
                <span className="material-symbols-outlined mr-3 text-sky-500">person</span>
                {t.setProfileTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow">{t.setProfileDescription}</p>
            <button onClick={onProfileClick} className="mt-4 self-start bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center group">
                {t.start}
                <span className="material-symbols-outlined !text-base ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;