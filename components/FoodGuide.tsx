
import React, { useState, useMemo, useEffect } from 'react';
import { FoodCategory, FoodTier, FoodTierName, FoodItem, FoodSubcategory, FoodTags, AiModalData, GroundingChunk } from '../types';
import Accordion from './Accordion';
import AiModal from './AiModal';
import * as aiService from '../services/aiService';
import AddFoodModal from './AddFoodModal';
import { FILTER_OPTIONS } from '../constants';
import FilterPanel from './FilterPanel';
import Loader from './Loader';

const getTierColorClasses = (tier: FoodTierName) => {
    switch (tier) {
        case 'TOP': return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md';
        case 'A': return 'bg-green-600 text-white';
        case 'B': return 'bg-blue-600 text-white';
        case 'C': return 'bg-cyan-500 text-white';
        case 'D': return 'bg-orange-500 text-white';
        case 'E': return 'bg-red-600 text-white';
        default: return 'bg-slate-400 text-white';
    }
};

const parseMarkdown = (text: string | undefined | null) => {
    if (!text) return { __html: '' };
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(\n|^)\s*[-*]\s/g, '$1<br>• ')
        .replace(/\n/g, '<br />');
    return { __html: html };
}

interface FoodGuideProps {
    foodData: FoodCategory[];
    onAddFood: (newFood: FoodItem, categoryName: string, subcategoryName: string) => void;
    onAddToShoppingList: (name: string) => void;
}

const FoodGuide: React.FC<FoodGuideProps> = ({ foodData, onAddFood, onAddToShoppingList }) => {
    const [aiModalData, setAiModalData] = useState<AiModalData | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // States for Seasonal Foods section
    const [seasonalContent, setSeasonalContent] = useState<string | null>(null);
    const [seasonalSources, setSeasonalSources] = useState<GroundingChunk[]>([]);
    const [isSeasonalLoading, setIsSeasonalLoading] = useState(true);
    const [seasonalError, setSeasonalError] = useState<string | null>(null);

    const [justAdded, setJustAdded] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeasonalFoods = async () => {
            setIsSeasonalLoading(true);
            setSeasonalError(null);
            try {
                const response = await aiService.getSeasonalFoods();
                const text = response.text;
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
                setSeasonalContent(text);
                setSeasonalSources(sources as GroundingChunk[]);
            } catch (err) {
                console.error(err);
                setSeasonalError(err instanceof Error ? err.message : 'Nu s-au putut încărca datele sezoniere.');
            } finally {
                setIsSeasonalLoading(false);
            }
        };

        fetchSeasonalFoods();
    }, []);

    const avoidFoods = useMemo(() => {
        const foods: FoodItem[] = [];
        foodData.forEach(cat => {
            cat.subcategories.forEach(subcat => {
                subcat.tiers.forEach(tier => {
                    if (tier.name === 'D' || tier.name === 'E') {
                        foods.push(...tier.foods);
                    }
                });
            });
        });
        foods.sort((a, b) => {
            const tierOrder: Record<string, number> = { 'E': 0, 'D': 1 };
            return (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99);
        });
        return foods;
    }, [foodData]);


    const initialFilters: FoodTags = {
        regions: [],
        benefitsForOrgans: [],
        dietaryCompatibility: [],
        nutritionalProfile: [],
    };
    const [filters, setFilters] = useState<FoodTags>(initialFilters);
    // FIX: Explicitly typed the accumulator of the reduce function to `number` to resolve a type inference issue
    // that caused the accumulator to be inferred as `unknown`.
    const activeFilterCount = useMemo(() => Object.values(filters).reduce((acc: number, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0), [filters]);

    const handleAlternativeRequest = async (foodName: string) => {
        setAiModalData({
            title: `Alternativă pentru: ${foodName}`,
            icon: 'auto_awesome',
            content: '',
            isLoading: true,
            isStreaming: true,
        });
        try {
            const stream = await aiService.getAlternativeForUnhealthyFoodStream(foodName);
            setAiModalData(prev => ({ ...prev!, isLoading: false }));
            for await (const chunk of stream) {
                setAiModalData(prev => ({ ...prev!, content: (prev?.content || '') + chunk }));
            }
        } catch (error) {
            console.error("Failed to get alternative:", error);
            setAiModalData(prev => ({ ...prev!, content: "Nu s-a putut genera o alternativă.", isLoading: false, isStreaming: false }));
        } finally {
             setAiModalData(prev => ({ ...prev!, isStreaming: false }));
        }
    };

    const handleAddToList = (name: string) => {
        onAddToShoppingList(name);
        setJustAdded(name);
        setTimeout(() => setJustAdded(null), 1500);
    };
    
    const isSearching = searchTerm.trim().length > 0;
    const isFiltering = activeFilterCount > 0;

    const filteredData = useMemo(() => {
        let dataToFilter = JSON.parse(JSON.stringify(foodData));

        if (isSearching) {
            const lowercasedFilter = searchTerm.toLowerCase();
            dataToFilter = dataToFilter.map((category: FoodCategory) => ({
                ...category,
                subcategories: category.subcategories.map(subcategory => ({
                    ...subcategory,
                    tiers: subcategory.tiers.map(tier => ({
                        ...tier,
                        foods: tier.foods.filter(food => food.name.toLowerCase().includes(lowercasedFilter)),
                    })).filter(tier => tier.foods.length > 0),
                })).filter(subcategory => subcategory.tiers.length > 0),
            })).filter((category: FoodCategory) => category.subcategories.length > 0);
        }

        if (isFiltering) {
             dataToFilter = dataToFilter.map((category: FoodCategory) => ({
                ...category,
                subcategories: category.subcategories.map(subcategory => ({
                    ...subcategory,
                    tiers: subcategory.tiers.map(tier => ({
                        ...tier,
                        foods: tier.foods.filter((food: FoodItem) => {
                            if (!food.tags) return false;
                            
                            const checkFilter = (filterKey: keyof FoodTags) => {
                                const activeFilters = filters[filterKey];
                                if (!activeFilters || activeFilters.length === 0) return true;
                                const foodTags = food.tags?.[filterKey];
                                if (!foodTags) return false;
                                return activeFilters.every(filter => foodTags.includes(filter));
                            };
                            
                            return (
                                checkFilter('regions') &&
                                checkFilter('benefitsForOrgans') &&
                                checkFilter('dietaryCompatibility') &&
                                checkFilter('nutritionalProfile')
                            );
                        }),
                    })).filter(tier => tier.foods.length > 0),
                })).filter(subcategory => subcategory.tiers.length > 0),
            })).filter((category: FoodCategory) => category.subcategories.length > 0);
        }

        return dataToFilter;
    }, [searchTerm, isSearching, foodData, filters, isFiltering]);

    const handleSaveFood = (newFood: FoodItem, categoryName: string, subcategoryName: string) => {
        onAddFood(newFood, categoryName, subcategoryName);
        setIsAddModalOpen(false);
    };

    const handleRemoveFilter = (filterKey: keyof FoodTags, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey]?.filter(item => item !== value) || []
        }));
    };
    
    const renderActiveFilters = () => {
        if (!isFiltering) return null;

        const allFilters: { key: keyof FoodTags, value: string }[] = [];
        for (const key in filters) {
            filters[key as keyof FoodTags]?.forEach(value => {
                allFilters.push({ key: key as keyof FoodTags, value });
            });
        }

        return (
            <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">Filtre Active:</h4>
                <div className="flex flex-wrap gap-2">
                    {allFilters.map(({key, value}) => (
                         <span key={`${key}-${value}`} className="inline-flex items-center bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {value}
                            <button onClick={() => handleRemoveFilter(key, value)} className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800/60">
                                <span className="material-symbols-outlined !text-xs">close</span>
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderSources = () => {
        const webSources = seasonalSources.filter(s => s.web && s.web.uri);
        if (webSources.length === 0) return null;

        return (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Surse:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {webSources.map((source, index) => (
                        <li key={index}>
                            <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">
                                {source.web!.title || source.web!.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderSeasonalSection = () => (
        <Accordion
            isOpenInitially={false}
            title={
                <h3 className="text-lg font-bold flex items-center text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined mr-3">eco</span>Ce este de Sezon Acum?
                </h3>
            }
            titleClassName="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
            wrapperClassName="border border-green-200 dark:border-green-800 rounded-xl shadow-sm overflow-hidden"
        >
             <div className="p-4">
                {isSeasonalLoading && <Loader text="Se încarcă informațiile..." />}
                {seasonalError && (
                     <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-lg">
                        <p className="font-bold">Eroare</p>
                        <p>{seasonalError}</p>
                    </div>
                )}
                {seasonalContent && !isSeasonalLoading && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={parseMarkdown(seasonalContent)} />
                        {renderSources()}
                    </div>
                )}
            </div>
        </Accordion>
    );

    const renderAvoidListSection = () => (
         <Accordion
            isOpenInitially={false}
            title={
                <h3 className="text-lg font-bold flex items-center text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined mr-3">block</span>Alimente de Limitat sau Evitat (Nivel D & E)
                </h3>
            }
            titleClassName="p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
            wrapperClassName="border border-red-200 dark:border-red-800 rounded-xl shadow-sm overflow-hidden"
        >
            <div className="p-1 sm:p-4">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Aliment</th>
                                <th className="py-3 px-4 font-semibold text-center">Nivel</th>
                                <th className="py-3 px-4 font-semibold">Motiv Principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avoidFoods.length > 0 ? (
                                avoidFoods.map(food => (
                                    <tr key={food.id || food.name} className="border-b border-slate-100 dark:border-slate-800 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 flex items-center">
                                            {food.name}
                                            {food.isCustom && <span title="Adăugat de tine" className="material-symbols-outlined !text-sm ml-2 text-sky-600 dark:text-sky-400">person</span>}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`w-7 h-7 ${getTierColorClasses(food.tier)} rounded-full text-xs font-bold inline-flex items-center justify-center`}>
                                                {food.tier}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{food.cons || food.info}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                        Felicitări! Nu sunt listate alimente cu risc ridicat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-lg">
                    <p className="font-bold">Notă:</p>
                    <p className="text-sm mt-1">Aceste alimente ar trebui consumate extrem de rar (Nivel D) sau eliminate complet (Nivel E) din dietă din cauza riscurilor mari de sănătate pe termen lung.</p>
                </div>
            </div>
        </Accordion>
    );

    return (
        <div className="space-y-6 relative">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">Ghid Interactiv de Alimentație</h2>
            
            <div className="space-y-4">
                {renderSeasonalSection()}
                {renderAvoidListSection()}
            </div>
            
            <hr className="my-8 border-slate-200 dark:border-slate-700" />
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">Explorează Ghidul Complet pe Niveluri</h3>

            <div className="flex gap-2 items-center">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Caută un aliment în ghid..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                        aria-label="Caută aliment"
                    />
                </div>
                 <button 
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} 
                    className="relative flex-shrink-0 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold p-3 sm:px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition flex items-center"
                >
                    <span className="material-symbols-outlined sm:mr-2">filter_list</span>
                    <span className="hidden sm:inline">Filtrează</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {isFilterPanelOpen && (
                <FilterPanel 
                    initialFilters={filters}
                    onApply={(newFilters) => {
                        setFilters(newFilters);
                        setIsFilterPanelOpen(false);
                    }}
                    onReset={() => {
                        setFilters(initialFilters);
                    }}
                />
            )}

            {renderActiveFilters()}

            <div className="card p-4">
                <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">Legendă Niveluri:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('TOP')} mr-2`}></span>TOP: Cele mai bune</span>
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('A')} mr-2`}></span>A: Excelente</span>
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('B')} mr-2`}></span>B: Bune</span>
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('C')} mr-2`}></span>C: Acceptabile</span>
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('D')} mr-2`}></span>D: Limitate</span>
                    <span className="flex items-center"><span className={`w-3 h-3 rounded-full ${getTierColorClasses('E')} mr-2`}></span>E: De Evitat</span>
                </div>
            </div>

            <div className="space-y-3">
                {filteredData.length > 0 ? (
                    filteredData.map((category: FoodCategory) => (
                        <Accordion
                            key={`${category.name}-${isSearching}-${isFiltering}`}
                            isOpenInitially={isSearching || isFiltering}
                            title={
                                <h3 className={`text-lg font-bold flex items-center ${category.color}`}>
                                    <span className="mr-3 text-2xl">{category.icon}</span>{category.name}
                                </h3>
                            }
                            titleClassName="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            wrapperClassName="card !p-0 overflow-hidden"
                        >
                            <div className="p-2 sm:p-3 space-y-2 bg-slate-50 dark:bg-slate-800/50">
                                {category.subcategories.map((subcategory: FoodSubcategory) => (
                                     <Accordion
                                        key={`${category.name}-${subcategory.name}-${isSearching}-${isFiltering}`}
                                        isOpenInitially={isSearching || isFiltering}
                                        title={
                                            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">{subcategory.name}</h4>
                                        }
                                        titleClassName="py-3 px-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                                        wrapperClassName="border-l-4 border-slate-200 dark:border-slate-700"
                                        isNested
                                     >
                                         <div className="pl-2 space-y-1">
                                            {subcategory.tiers.map((tier: FoodTier) => (
                                                <Accordion
                                                    key={`${category.name}-${subcategory.name}-${tier.name}-${isSearching}-${isFiltering}`}
                                                    isOpenInitially={isSearching || isFiltering}
                                                    title={
                                                        <div className="flex items-center">
                                                            <span className={`w-6 h-6 ${getTierColorClasses(tier.name)} rounded-full text-xs font-bold flex items-center justify-center mr-3`}>{tier.name}</span>
                                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nivel {tier.name}</span>
                                                        </div>
                                                    }
                                                    titleClassName="py-3 px-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                                                    wrapperClassName=""
                                                    isNested
                                                >
                                                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                        {tier.foods.map(food => (
                                                            <div key={food.id || food.name} className="flex flex-col sm:flex-row justify-between items-start py-3 px-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                                <div className="flex-1 min-w-0 pr-4">
                                                                    <div className="flex items-center mb-1">
                                                                        <p className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                                                                            {food.name}
                                                                            {food.isCustom && <span title="Adăugat de tine" className="material-symbols-outlined !text-sm ml-2 text-sky-600 dark:text-sky-400">person</span>}
                                                                        </p>
                                                                        <button 
                                                                            onClick={() => handleAddToList(food.name)}
                                                                            className="ml-2 text-slate-400 hover:text-emerald-500 dark:text-slate-500 dark:hover:text-emerald-400 transition-colors"
                                                                            title="Adaugă la lista de cumpărături"
                                                                        >
                                                                            <span className="material-symbols-outlined !text-base">{justAdded === food.name ? 'check' : 'add_shopping_cart'}</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs text-slate-600 dark:text-slate-400"><strong className="text-green-700 dark:text-green-400">Info:</strong> {food.info}</p>
                                                                        {food.cons && <p className="text-xs text-slate-500 dark:text-slate-400/80"><strong className="text-red-600 dark:text-red-400">Contra:</strong> {food.cons}</p>}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center flex-shrink-0 mt-2 sm:mt-0 self-end sm:self-center">
                                                                    {(food.tier === 'C' || food.tier === 'D' || food.tier === 'E') && (
                                                                        <button onClick={() => handleAlternativeRequest(food.name)} className="bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold py-1 px-2 rounded-full transition-colors flex items-center shadow-md">
                                                                            <span className="material-symbols-outlined !text-xs mr-1">auto_awesome</span> Alternativă
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Accordion>
                                            ))}
                                        </div>
                                     </Accordion>
                                ))}
                            </div>
                        </Accordion>
                    ))
                ) : (
                    <div className="text-center py-10 px-4 card">
                        <p className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Niciun aliment găsit</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Încearcă să schimbi termenul de căutare sau ajustează filtrele.</p>
                    </div>
                )}
            </div>
             {aiModalData && <AiModal data={aiModalData} onClose={() => setAiModalData(null)} />}
             {isAddModalOpen && <AddFoodModal foodData={foodData} onSave={handleSaveFood} onClose={() => setIsAddModalOpen(false)} />}
             
             <button
                onClick={() => setIsAddModalOpen(true)}
                title="Adaugă un aliment nou"
                className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 z-40"
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
};

export default FoodGuide;