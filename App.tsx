
import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { ActiveTab, DietaryProfile, FoodCategory, FoodItem, Product, FoodSubcategory, DailyLog, LoggedMeal, WaterLog, ShoppingItem } from './types';
import FoodGuide from './components/FoodGuide';
import Analyzer from './components/Analyzer';
import ProfileModal from './components/ProfileModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import { FOOD_GUIDE_DATA } from './services/foodDatabase';
import RecipeGenerator from './components/RecipeGenerator';
import { translations, Language } from './translations';

const Header: React.FC<{ 
    onProfileClick: () => void; 
    theme: 'light' | 'dark'; 
    onThemeToggle: () => void; 
    language: Language;
    onLanguageChange: (lang: Language) => void;
}> = ({ onProfileClick, theme, onThemeToggle, language, onLanguageChange }) => {
    const t = translations[language].header;
    const [isLangOpen, setIsLangOpen] = useState(false);

    return (
        <div className="page-header">
            <header className="container mx-auto max-w-5xl grid grid-cols-[1fr,auto,1fr] items-center">
                {/* Left spacer for symmetry. The grid will handle the sizing. */}
                <div></div>
                
                <div className="text-center px-2">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 tracking-tight header-text-shadow">{t.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">{t.subtitle}</p>
                </div>

                <div className="flex justify-end items-center gap-1">
                    <div className="relative">
                        <button onClick={() => setIsLangOpen(!isLangOpen)} title={t.changeLanguage} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined">language</span>
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border dark:border-slate-700 z-10">
                                <button onClick={() => { onLanguageChange('ro'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'ro' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-700`}>Română</button>
                                <button onClick={() => { onLanguageChange('en'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-700`}>English</button>
                            </div>
                        )}
                    </div>
                    <button onClick={onThemeToggle} title={t.changeTheme} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
                    </button>
                    <button onClick={onProfileClick} title={t.dietaryProfile} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">person</span>
                    </button>
                </div>
            </header>
        </div>
    );
}

const Tabs: React.FC<{ activeTab: ActiveTab; onTabChange: (tab: ActiveTab) => void; language: Language; }> = ({ activeTab, onTabChange, language }) => {
    const t = translations[language].tabs;
    const tabs: { id: ActiveTab; label: string; icon: string }[] = [
        { id: 'dashboard', label: t.home, icon: 'dashboard' },
        { id: 'analyzer', label: t.analyzer, icon: 'barcode_scanner' },
        { id: 'journal', label: t.journal, icon: 'history_edu' },
        { id: 'recipes', label: t.recipes, icon: 'soup_kitchen' },
        { id: 'guide', label: t.guide, icon: 'restaurant' },
    ];

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<ActiveTab, HTMLButtonElement | null>>({} as any);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);

    const updateIndicator = useCallback(() => {
        const activeTabElement = tabRefs.current[activeTab];
        if (activeTabElement && tabsContainerRef.current) {
            const containerRect = tabsContainerRef.current.getBoundingClientRect();
            const tabRect = activeTabElement.getBoundingClientRect();
            setIndicatorStyle({
                left: tabRect.left - containerRect.left,
                width: tabRect.width,
            });
            setIsIndicatorVisible(true);
        }
    }, [activeTab]);

    useEffect(() => {
        // Wait for fonts to be ready to prevent layout shifts on initial load
        document.fonts.ready.then(() => {
            updateIndicator();
        });
    
        window.addEventListener('resize', updateIndicator);
        return () => {
            window.removeEventListener('resize', updateIndicator);
        };
    }, [updateIndicator]);


    return (
        <div ref={tabsContainerRef} className="my-6 sm:my-8 tab-button-container">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    ref={el => { tabRefs.current[tab.id] = el }}
                    onClick={() => onTabChange(tab.id)}
                    className={`tab-button flex-1 py-3 px-2 sm:px-4 text-sm font-semibold text-center rounded-full flex items-center justify-center sm:gap-2 transition-colors duration-300 ${
                        activeTab === tab.id ? 'active-tab' : ''
                    }`}
                    aria-label={tab.label}
                >
                    <span className="material-symbols-outlined !text-xl">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
            <span 
                className="active-tab-indicator" 
                style={{
                    ...indicatorStyle,
                    opacity: isIndicatorVisible ? 1 : 0,
                }}
            ></span>
        </div>
    );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [profile, setProfile] = useLocalStorage<DietaryProfile>('dietaryProfile', { 
    allergies: [], 
    preferences: [],
    calorieGoal: 2000,
    proteinGoal: 100,
    carbGoal: 250,
    fatGoal: 70
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [foodData, setFoodData] = useLocalStorage<FoodCategory[]>('foodGuideData', FOOD_GUIDE_DATA);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [dailyLog, setDailyLog] = useLocalStorage<DailyLog>('dailyLog', {});
  const [waterLog, setWaterLog] = useLocalStorage<WaterLog>('waterLog', {});
  const [language, setLanguage] = useLocalStorage<Language>('language', 'ro');
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingItem[]>('shoppingList', []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.lang = language;
  }, [theme, language]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSaveProfile = useCallback((newProfile: DietaryProfile) => {
    setProfile(newProfile);
    setIsProfileModalOpen(false);
  }, [setProfile]);

 const handleAddFood = useCallback((newFood: FoodItem, categoryName: string, subcategoryName: string) => {
    setFoodData(currentData => {
        const newData = JSON.parse(JSON.stringify(currentData));
        const categoryIndex = newData.findIndex((cat: FoodCategory) => cat.name === categoryName);
        if (categoryIndex === -1) {
            console.error("Category not found");
            return currentData;
        }

        const subcategoryIndex = newData[categoryIndex].subcategories.findIndex((sub: FoodSubcategory) => sub.name === subcategoryName);
        if (subcategoryIndex === -1) {
             console.error("Subcategory not found");
            return currentData;
        }
        
        const tierIndex = newData[categoryIndex].subcategories[subcategoryIndex].tiers.findIndex((t: any) => t.name === newFood.tier);
        if (tierIndex > -1) {
            newData[categoryIndex].subcategories[subcategoryIndex].tiers[tierIndex].foods.push(newFood);
        } else {
            newData[categoryIndex].subcategories[subcategoryIndex].tiers.push({ name: newFood.tier, foods: [newFood] });
        }
        
        // Sort tiers
        const tierOrder: Record<string, number> = { 'TOP': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 };
        newData[categoryIndex].subcategories[subcategoryIndex].tiers.sort((a: any, b: any) => tierOrder[a.name] - tierOrder[b.name]);


        return newData;
    });
}, [setFoodData]);

  const handleLogMeal = (meal: { photoBase64?: string, analysisText: string, nutrients: LoggedMeal['nutrients'] }) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const newMeal: LoggedMeal = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...meal
    };
    
    setDailyLog(prevLog => {
        const todayLog = prevLog[today] || [];
        return {
            ...prevLog,
            [today]: [...todayLog, newMeal]
        };
    });

    // Switch to journal tab to show the result
    setActiveTab('journal');
  };

  const handleAddWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterLog(prev => ({
        ...prev,
        [today]: (prev[today] || 0) + amount
    }));
  };

  const toggleShoppingItem = (id: string) => {
      setShoppingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addShoppingItem = (name: string) => {
      setShoppingList(prev => [...prev, { id: Date.now().toString(), name, checked: false }]);
  };

  const removeShoppingItem = (id: string) => {
      setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  dailyLog={dailyLog} 
                  waterLog={waterLog}
                  onAddWater={handleAddWater}
                  profile={profile} 
                  onTabChange={setActiveTab} 
                  onProfileClick={() => setIsProfileModalOpen(true)} 
                  language={language}
                  shoppingList={shoppingList}
                  onToggleShoppingItem={toggleShoppingItem}
                  onAddShoppingItem={addShoppingItem}
                  onRemoveShoppingItem={removeShoppingItem}
                />;
      case 'guide':
        return <FoodGuide foodData={foodData} onAddFood={handleAddFood} onAddToShoppingList={addShoppingItem} />;
      case 'analyzer':
        return <Analyzer profile={profile} currentProduct={currentProduct} setCurrentProduct={setCurrentProduct} onLogMeal={handleLogMeal} language={language} />;
      case 'journal':
        return <Journal dailyLog={dailyLog} profile={profile} />;
      case 'recipes':
        return <RecipeGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Header onProfileClick={() => setIsProfileModalOpen(true)} theme={theme} onThemeToggle={handleThemeToggle} language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto max-w-5xl px-2 sm:px-4 pb-12">
            <main>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} language={language} />
            <div className="fade-in">
                {renderContent()}
            </div>
            </main>
      </div>
      {isProfileModalOpen && (
        <ProfileModal 
            profile={profile} 
            onClose={() => setIsProfileModalOpen(false)} 
            onSave={handleSaveProfile} 
            language={language}
        />
      )}
    </div>
  );
};

export default App;