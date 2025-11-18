
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { DietaryProfile, HistoryItem, Product, PersonalizedAnalysisResult, ComparisonResult, AnalyzerMode, MealAnalysis } from '../types';
import * as aiService from '../services/aiService';
import Loader from './Loader';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FileUpload from './FileUpload';
import AnalysisResult from './AnalysisResult';
import ComparisonModal from './ComparisonModal';
import { translations, Language } from '../translations';
import LogMealModal from './LogMealModal';

const parseMarkdown = (text: string | undefined | null, isStreaming: boolean) => {
    if (!text) return { __html: '' };
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(\n|^)\s*[-*]\s/g, '$1<br>• ')
        .replace(/\n/g, '<br />');
    if (isStreaming) {
        html += '<span class="streaming-cursor"></span>';
    }
    return { __html: html };
}

interface AnalyzerProps {
    profile: DietaryProfile;
    currentProduct: Product | null;
    setCurrentProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    onLogMeal: (meal: { photoBase64?: string, analysisText: string, nutrients: MealAnalysis['nutrients'] }) => void;
    language: Language;
}

// --- Helper Components for Detailed View ---

const SectionHeader: React.FC<{ icon: string, title: string, subtitle?: string }> = ({ icon, title, subtitle }) => (
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center">
        <span className="material-symbols-outlined mr-3 text-slate-500 dark:text-slate-400">{icon}</span>
        {title}
        {subtitle && <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-auto">{subtitle}</span>}
    </h3>
);

const ScoreCard: React.FC<{ title: string, value: React.ReactNode, desc: string, children: React.ReactNode }> = ({ title, value, desc, children }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <h4 className="font-bold text-slate-700 dark:text-slate-300">{title}</h4>
        <div className="my-3">{children}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
);

const TrafficLight: React.FC<{ name: string, value?: number, type: 'fat' | 'saturated-fat' | 'sugars' | 'salt' }> = ({ name, value, type }) => {
    if (value === undefined || value === null) {
        return (
            <div className="text-center p-2 opacity-50">
                <div className="font-bold dark:text-slate-300">{name}</div>
                <div className="text-slate-500 mt-1">N/A</div>
            </div>
        );
    }
    
    const thresholds = {
        fat: { l: 3, h: 17.5 },
        'saturated-fat': { l: 1.5, h: 5 },
        sugars: { l: 5, h: 22.5 },
        salt: { l: 0.3, h: 1.5 }
    };
    
    let level = 'moderat';
    let colorClass = 'bg-yellow-400';
    
    if (value <= thresholds[type].l) {
        level = 'scăzut';
        colorClass = 'bg-green-500';
    } else if (value > thresholds[type].h) {
        level = 'ridicat';
        colorClass = 'bg-red-500';
    }
    
    return (
        <div className="text-center">
            <div className="font-bold text-slate-700 dark:text-slate-300">{name}</div>
            <div className={`${colorClass} text-white font-bold py-2 px-3 rounded-lg my-1 shadow-sm uppercase text-xs`}>{level}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{value.toFixed(1)}g</div>
        </div>
    );
};

const NutrInformBattery: React.FC<{ name: string, value?: number, daily: number, unit: string }> = ({ name, value, daily, unit }) => {
     if (value === undefined || value === null) {
        return (
            <div className="text-center p-2 opacity-50">
                <div className="font-bold text-sm dark:text-slate-300">{name}</div>
                <div className="text-slate-500 mt-1">N/A</div>
            </div>
        );
    }
    const percentage = Math.min((value / daily) * 100, 100).toFixed(0);
    
    return (
        <div className="flex flex-col items-center text-center">
            <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">{name}</div>
            <div className="w-12 h-20 bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg relative my-1 overflow-hidden">
                <div className="bg-indigo-500 absolute bottom-0 left-0 right-0 transition-all duration-500" style={{ height: `${percentage}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-white mix-blend-normal z-10 shadow-sm">{percentage}%</div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{value.toFixed(1)}{unit}</div>
        </div>
    );
};

const NutritionRow: React.FC<{ label: string, g?: number, s?: number, unit: string, precision?: number }> = ({ label, g, s, unit, precision = 1 }) => (
    <tr className="border-b border-slate-100 dark:border-slate-700 last:border-0">
        <td className="py-2 font-medium text-slate-800 dark:text-slate-200">{label}</td>
        <td className="py-2 text-right text-slate-600 dark:text-slate-400">{g !== undefined ? `${g.toFixed(precision)} ${unit}` : 'N/A'}</td>
        <td className="py-2 text-right text-slate-600 dark:text-slate-400">{s !== undefined ? `${s.toFixed(precision)} ${unit}` : 'N/A'}</td>
    </tr>
);

const AdditiveChip: React.FC<{ name: string, onClick: () => void }> = ({ name, onClick }) => (
    <button onClick={onClick} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono mr-2 mb-2 px-2.5 py-1 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1">
        {name}
        <span className="material-symbols-outlined !text-sm !leading-none text-slate-500 dark:text-slate-400">help_outline</span>
    </button>
);

const ComparisonSlot: React.FC<{product?: Product, onRemove: (code: string) => void}> = ({ product, onRemove }) => {
    if (!product) {
        return (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center h-full flex flex-col justify-center items-center">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl">add_box</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adaugă un produs</p>
            </div>
        );
    }
    return (
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg relative h-full">
            <button onClick={() => onRemove(product.code)} className="absolute top-1 right-1 bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300 hover:bg-red-500 hover:text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors z-10">
                <span className="material-symbols-outlined !text-sm">close</span>
            </button>
            <div className="flex items-center gap-3">
                <img src={product.image_small_url} alt={product.product_name} className="w-10 h-10 rounded-md object-contain bg-white" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{product.product_name}</p>
            </div>
        </div>
    );
};

const AnalyzerHubButton: React.FC<{
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    className: string;
}> = ({ icon, title, description, onClick, className }) => (
    <button
        onClick={onClick}
        className={`card text-left p-6 w-full h-full flex flex-col items-start hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200 group relative overflow-hidden ${className}`}
    >
        <div className={`p-3 bg-white/30 text-white rounded-lg mb-4 z-10`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="font-bold text-lg text-white mb-1 z-10">{title}</h3>
        <p className="text-sm text-white/80 flex-grow z-10">{description}</p>
        <span className="text-sm font-semibold text-white mt-4 self-end z-10">
            Începe <span className="material-symbols-outlined !text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 opacity-100 transition-opacity duration-300"></div>
    </button>
);


const Analyzer: React.FC<AnalyzerProps> = ({ profile, currentProduct, setCurrentProduct, onLogMeal, language }) => {
    const t = translations[language].analyzer;
    const [selectedMode, setSelectedMode] = useState<AnalyzerMode | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('scanHistory', []);
    const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
    
    const [ingredientPhoto, setIngredientPhoto] = useState<{file: File, base64: string} | null>(null);
    const [nutritionPhoto, setNutritionPhoto] = useState<{file: File, base64: string} | null>(null);

    const [personalizedResult, setPersonalizedResult] = useState<PersonalizedAnalysisResult | null>(null);
    const [isPersonalizedLoading, setIsPersonalizedLoading] = useState(false);
    const [personalizedError, setPersonalizedError] = useState<string | null>(null);
    const [geminiResult, setGeminiResult] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [ingredientsAnalysis, setIngredientsAnalysis] = useState<string | null>(null);
    const [isIngredientsAnalyzing, setIsIngredientsAnalyzing] = useState(false);
    const [additiveInfo, setAdditiveInfo] = useState<{name: string, content: string, isLoading: boolean} | null>(null);


    const [mealPhoto, setMealPhoto] = useState<{file: File, base64: string} | null>(null);
    const [mealAnalysisResult, setMealAnalysisResult] = useState<MealAnalysis | null>(null);
    const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
    const [isLogMealModalOpen, setIsLogMealModalOpen] = useState(false);
    const [mealToLog, setMealToLog] = useState<{ photoBase64?: string; analysisText: string; nutrients: MealAnalysis['nutrients']; } | null>(null);


    const [recipeUrl, setRecipeUrl] = useState('');
    const [recipeAnalysisResult, setRecipeAnalysisResult] = useState<string | null>(null);
    const [isAnalyzingRecipe, setIsAnalyzingRecipe] = useState(false);

    const [menuPhoto, setMenuPhoto] = useState<{file: File, base64: string} | null>(null);
    const [menuAnalysisResult, setMenuAnalysisResult] = useState<string | null>(null);
    const [isAnalyzingMenu, setIsAnalyzingMenu] = useState(false);

    const [isDetectionIndicatorVisible, setIsDetectionIndicatorVisible] = useState(false);
    
    const [comparisonList, setComparisonList] = useState<Product[]>([]);
    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [isComparing, setIsComparing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const isMounted = useRef(true);

    const resetProductState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setCurrentProduct(null);
        setShowCreateProduct(false);
        setPersonalizedResult(null);
        setIsPersonalizedLoading(false);
        setPersonalizedError(null);
        setGeminiResult(null);
        setIngredientsAnalysis(null);
        setAdditiveInfo(null);
        setIngredientPhoto(null);
        setNutritionPhoto(null);
    }, [setCurrentProduct]);
    
    const stopScanner = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        codeReader.current.reset();
        setIsScanning(false);
    }, []);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            stopScanner();
        };
    }, [stopScanner]);

    const addToHistory = useCallback((product: Product) => {
        const historyItem: HistoryItem = {
            barcode: product.code,
            name: product.product_name_ro || product.product_name,
            image: product.image_small_url,
        };
        setHistory(prevHistory => {
            const newHistory = [historyItem, ...prevHistory.filter(item => item.barcode !== product.code)];
            return newHistory.slice(0, 30);
        });
    }, [setHistory]);

    const calculateExpertScore = (nutriScore: string, novaGroup: number | string | undefined, nutriments: any) => {
        let s = 10;
        const ns = nutriScore ? nutriScore.toUpperCase() : '';
        const nova = novaGroup ? parseInt(String(novaGroup)) : 0;

        if (ns === 'B') s -= 1;
        if (ns === 'C') s -= 3;
        if (ns === 'D') s -= 5;
        if (ns === 'E') s -= 7;
        
        if (nova === 3) s -= 1;
        if (nova === 4) s -= 3;

        if (nutriments?.fat_100g > 17.5) s -= 0.5;
        if (nutriments?.['saturated-fat_100g'] > 5) s -= 1;
        if (nutriments?.sugars_100g > 22.5) s -= 1;
        if (nutriments?.salt_100g > 1.5) s -= 1;

        return Math.max(0, Math.round(s * 10) / 10);
    };

    const fetchProductData = useCallback(async (barcode: string) => {
        if (!barcode) return;
        resetProductState();
        setIsLoading(true);

        try {
            const fetchFromDomain = async (domain: string) => {
                 const response = await fetch(`https://${domain}/api/v2/product/${barcode}.json`);
                 if (response.ok) {
                     const data = await response.json();
                     if (data.status === 1 && data.product) return data.product;
                 }
                 return null;
            };

            let product = await fetchFromDomain('ro.openfoodfacts.org');
            if (!product) {
                product = await fetchFromDomain('world.openfoodfacts.org');
            }

            if (product) {
                if (!isMounted.current) return;
                const categories = (product.categories || '').toLowerCase();
                const isCosmetic = categories.includes('cosmetic') || categories.includes('beauty') || categories.includes('skin care');
                
                if (isCosmetic) {
                     let beautyProduct = await fetchFromDomain('ro.openbeautyfacts.org');
                     if(!beautyProduct) beautyProduct = await fetchFromDomain('world.openbeautyfacts.org');
                     product = beautyProduct || product;
                     product.isCosmetic = true;
                }

                setCurrentProduct(product);
                addToHistory(product);
            } else {
                throw new Error('Produsul nu a fost găsit.');
            }
        } catch (err) {
             if (!isMounted.current) return;
             setError(`Produsul cu codul ${barcode} nu a fost găsit. Vă rugăm să folosiți opțiunea de creare din fotografii.`);
             setShowCreateProduct(true);
             setCurrentProduct({ code: barcode });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [resetProductState, setCurrentProduct, addToHistory]);
    
    const startScanner = useCallback(async () => {
        resetProductState();
        setIsScanning(true);
        setError(null);

        try {
            const videoInputDevices = await codeReader.current.listVideoInputDevices();
            // Fallback to default if no back camera explicitly found
            const deviceId = (videoInputDevices.find(d => d.label.toLowerCase().includes('back')) || videoInputDevices[0])?.deviceId;
            
            if (!deviceId) {
                throw new Error("Nu s-a găsit nicio cameră.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: deviceId },
                }
            });
            
            streamRef.current = stream;

            const [track] = stream.getVideoTracks();
            const capabilities = track.getCapabilities();
            
            if ('focusMode' in capabilities) {
                try {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'continuous' } as any]
                    });
                } catch (e) {
                    console.warn('Continuous focus not supported or failed to apply.', e);
                }
            }
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                while (isMounted.current && streamRef.current?.active) {
                    try {
                        if (!videoRef.current) break;
                        const result = await codeReader.current.decodeFromVideoElement(videoRef.current);
                        
                        if (isMounted.current) {
                            setIsDetectionIndicatorVisible(true);
                            if (navigator.vibrate) navigator.vibrate(100);

                            setTimeout(() => {
                                stopScanner();
                                fetchProductData(result.getText());
                                setIsDetectionIndicatorVisible(false);
                            }, 500);
                        }
                        return;
                    } catch (err) {
                        if (err instanceof NotFoundException) {
                            // Continue scanning
                        } else if (isMounted.current) {
                            console.error(err);
                            // If unexpected error during decode, stop and show error
                            setError('Eroare la scanare.');
                            stopScanner();
                            return;
                        }
                    }
                    // Add a small delay to prevent CPU hogging in the loop if decodeFromVideoElement resolves immediately without detection (unlikely but safe)
                    await new Promise(resolve => setTimeout(resolve, 100)); 
                }
            }
        } catch (err) {
            if (!isMounted.current) return;
            console.error(err);
            setError('Nu s-a putut accesa camera. Vă rugăm introduceți codul manual.');
            stopScanner();
            setIsManualEntryVisible(true); // Automatically show manual entry
        }
    }, [resetProductState, stopScanner, fetchProductData]);

    const handleGenerateReport = async () => {
        if (!ingredientPhoto || !nutritionPhoto) {
            setError('Vă rugăm să încărcați ambele imagini.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPersonalizedResult(null);
        setGeminiResult(null);
        try {
            const report = await aiService.analyzeProductImages(ingredientPhoto.base64, nutritionPhoto.base64);
            if (!isMounted.current) return;
            setCurrentProduct(prev => ({ code: prev?.code || 'custom', product_name: 'Produs Analizat din Imagini', ingredients_text: 'Extras din imagine' }));
            setGeminiResult(report);
        } catch (err) {
            console.error(err);
            if (!isMounted.current) return;
            setError(err instanceof Error ? err.message : 'A apărut o eroare la analiza AI.');
        } finally {
            if (!isMounted.current) return;
            setIsLoading(false);
        }
    };
    
    const handleGeminiRequest = async (type: 'isGoodForMe' | 'alternatives' | 'mealIdea' | 'homeMade') => {
        if (!currentProduct) return;

        if (type === 'isGoodForMe') {
            setIsPersonalizedLoading(true);
            setPersonalizedResult(null);
            setPersonalizedError(null);
            setGeminiResult(null);
            try {
                const result = await aiService.getPersonalizedAnalysis(currentProduct, profile);
                if (!isMounted.current) return;
                setPersonalizedResult(result);
            } catch (err) {
                if (!isMounted.current) return;
                const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la analiza AI.';
                setPersonalizedError(errorMessage);
            } finally {
                if (!isMounted.current) return;
                setIsPersonalizedLoading(false);
            }
        } else {
            setGeminiResult('');
            setPersonalizedResult(null);
            setPersonalizedError(null);
            setIsStreaming(true);
            try {
                let stream;
                switch (type) {
                    case 'alternatives': stream = await aiService.getHealthyAlternativesStream(currentProduct); break;
                    case 'mealIdea': stream = await aiService.getMealIdeaStream(currentProduct); break;
                    case 'homeMade': stream = await aiService.getHomemadeRecipeStream(currentProduct); break;
                }
                for await (const chunk of stream) {
                    if (!isMounted.current) return;
                    setGeminiResult(prev => (prev || '') + chunk);
                }
            } catch (err) {
                 if (!isMounted.current) return;
                 const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la analiza AI.';
                 setGeminiResult(errorMessage);
            } finally {
                if (!isMounted.current) return;
                setIsStreaming(false);
            }
        }
    }

    const handleAnalyzeIngredients = async () => {
        if (!currentProduct?.ingredients_text && !currentProduct?.ingredients_text_ro && !currentProduct?.ingredients_text_with_allergens) return;
        const text = currentProduct.ingredients_text_ro || currentProduct.ingredients_text || currentProduct.ingredients_text_with_allergens || '';
        setIsIngredientsAnalyzing(true);
        setIngredientsAnalysis('');
        try {
            const stream = await aiService.analyzeIngredientsList(text, !!currentProduct.isCosmetic);
            for await (const chunk of stream) {
                if (!isMounted.current) return;
                setIngredientsAnalysis(prev => (prev || '') + chunk);
            }
        } catch (err) {
            if (!isMounted.current) return;
             setIngredientsAnalysis('Nu s-a putut analiza lista de ingrediente.');
        } finally {
            if (!isMounted.current) return;
            setIsIngredientsAnalyzing(false);
        }
    }

    const handleAdditiveClick = async (additiveName: string) => {
        const cleanedName = additiveName.replace(/ro:|en:/g, ' ').trim();
        setAdditiveInfo({ name: cleanedName, content: '', isLoading: true });
        try {
            const explanation = await aiService.getAdditiveExplanation(cleanedName);
            if (!isMounted.current) return;
            setAdditiveInfo({ name: cleanedName, content: explanation, isLoading: false });
        } catch (err) {
            if (!isMounted.current) return;
            setAdditiveInfo({ name: cleanedName, content: 'Nu s-au putut obține informații.', isLoading: false });
        }
    }

    const handleAnalyzeMeal = async () => {
        if (!mealPhoto) return;
        setMealAnalysisResult(null);
        setIsAnalyzingMeal(true);
        setError(null);
        try {
            const result = await aiService.analyzeMealPhoto(mealPhoto.base64);
            if (!isMounted.current) return;
            setMealAnalysisResult(result);
        } catch (err) {
            if (!isMounted.current) return;
            const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la analiza AI.';
            setError(errorMessage);
        } finally {
            if (!isMounted.current) return;
            setIsAnalyzingMeal(false);
        }
    }

    const handleOpenLogModal = () => {
        if (mealAnalysisResult) {
            setMealToLog({
                photoBase64: mealPhoto?.base64,
                analysisText: mealAnalysisResult.analysisText,
                nutrients: mealAnalysisResult.nutrients,
            });
            setIsLogMealModalOpen(true);
        }
    };

    const handleConfirmLogMeal = (meal: { photoBase64?: string; analysisText: string; nutrients: MealAnalysis['nutrients']; }) => {
        onLogMeal(meal);
        setIsLogMealModalOpen(false);
        setMealToLog(null);
        // Reset meal analyzer UI
        setMealAnalysisResult(null);
        setMealPhoto(null);
    };

    const handleAnalyzeRecipe = async () => {
        if (!recipeUrl.trim()) return;
        setRecipeAnalysisResult('');
        setIsAnalyzingRecipe(true);
        setError(null);
        try {
            const stream = await aiService.analyzeRecipeFromUrlStream(recipeUrl);
            for await (const chunk of stream) {
                if (!isMounted.current) return;
                setRecipeAnalysisResult(prev => (prev || '') + chunk);
            }
        } catch (err) {
            if (!isMounted.current) return;
            const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la analiza AI.';
            setRecipeAnalysisResult(errorMessage);
            setError(errorMessage);
        } finally {
            if (!isMounted.current) return;
            setIsAnalyzingRecipe(false);
        }
    };

    const handleAnalyzeMenu = async () => {
        if (!menuPhoto) return;
        setMenuAnalysisResult('');
        setIsAnalyzingMenu(true);
        setError(null);
        try {
            const stream = await aiService.analyzeRestaurantMenuStream(menuPhoto.base64);
            for await (const chunk of stream) {
                if (!isMounted.current) return;
                setMenuAnalysisResult(prev => (prev || '') + chunk);
            }
        } catch (err) {
            if (!isMounted.current) return;
            const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la analiza AI a meniului.';
            setError(errorMessage);
            setMenuAnalysisResult(errorMessage);
        } finally {
            if (!isMounted.current) return;
            setIsAnalyzingMenu(false);
        }
    };
    
    const handleAddToCompare = useCallback((product: Product) => {
        setComparisonList(prev => {
            if (prev.length >= 2 || prev.find(p => p.code === product.code)) return prev;
            return [...prev, product];
        });
    }, []);

    const handleRemoveFromCompare = useCallback((productCode: string) => {
        setComparisonList(prev => prev.filter(p => p.code !== productCode));
    }, []);

    const handleStartComparison = async () => {
        if (comparisonList.length !== 2) return;
        setIsComparing(true);
        setComparisonResult(null);
        setIsComparisonModalOpen(true);
        try {
            const result = await aiService.compareProducts(comparisonList[0], comparisonList[1]);
            if (!isMounted.current) return;
            setComparisonResult(result);
        } catch (err) {
            console.error("Comparison failed:", err);
            if (!isMounted.current) return;
            setError("A apărut o eroare la comparația AI.");
            setIsComparisonModalOpen(false);
        } finally {
            if (!isMounted.current) return;
            setIsComparing(false);
        }
    };
    
    const renderProductAnalyzer = () => {
        const product = currentProduct;
        const nutriments = product?.nutriments || {};
        const nutriScore = product?.nutriscore_grade ? product.nutriscore_grade.toUpperCase() : 'N/A';
        const novaGroup = product?.nova_group;
        const expertScore = product ? calculateExpertScore(nutriScore, novaGroup, nutriments) : 0;

        const nutriScoreColors: any = { 'A': 'bg-green-600', 'B': 'bg-lime-500', 'C': 'bg-yellow-400 text-slate-800', 'D': 'bg-orange-500', 'E': 'bg-red-600' };
        const novaColors: any = { '1': 'bg-green-500', '2': 'bg-lime-500', '3': 'bg-orange-500', '4': 'bg-red-600' };
        const expertScoreColor = expertScore >= 8 ? 'bg-green-600' : expertScore >= 6 ? 'bg-lime-500' : expertScore >= 4 ? 'bg-yellow-400 text-slate-800' : expertScore >= 2 ? 'bg-orange-500' : 'bg-red-600';

        const servingSize = product?.serving_size ? product.serving_size.replace(/[^0-9.a-zA-Z ]/g, '') : '100g';
        const getNutrientForServing = (baseName: string) => {
            const servingValue = (nutriments as any)[`${baseName}_serving`];
            if (servingValue !== undefined) return servingValue;
            const per100gValue = (nutriments as any)[`${baseName}_100g`];
            const servingQty = parseFloat(product?.serving_quantity || '0');
            if (per100gValue !== undefined && !isNaN(servingQty)) { return (per100gValue / 100) * servingQty; }
            return undefined;
        };

        const nutrientLevels = product?.nutrient_levels || {};

        return (
        <div className="space-y-6">
            {isScanning && (
                <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline></video>
                    <div className="scan-region-overlay">
                        <div className={`scan-box ${isDetectionIndicatorVisible ? 'scan-box--detected' : ''}`}></div>
                    </div>
                    <div className="scanner-laser"></div>
                </div>
            )}
            <button onClick={isScanning ? stopScanner : startScanner} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-lg py-4 px-4 rounded-xl transition-all transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg flex items-center justify-center">
                <span className={`material-symbols-outlined mr-2 ${isScanning ? 'animate-spin' : ''}`}>{isScanning ? 'autorenew' : 'barcode_scanner'}</span>
                {isScanning ? 'Se scanează...' : 'Scanează Codul de Bare'}
            </button>
            <div className="text-center">
                <button onClick={() => setIsManualEntryVisible(!isManualEntryVisible)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors">
                    {isManualEntryVisible ? 'Ascunde introducerea manuală' : 'Sau introdu codul manual'}
                </button>
            </div>
            {isManualEntryVisible && (
                <div className="flex gap-2 animate-fadeIn">
                    <input type="text" placeholder="Introdu codul de bare" className="flex-grow w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-500 focus:border-blue-500 dark:focus:border-sky-500 transition bg-white dark:bg-slate-700" onKeyDown={(e) => e.key === 'Enter' && fetchProductData((e.target as HTMLInputElement).value)} />
                    <button onClick={() => fetchProductData( (document.querySelector('input[type="text"]') as HTMLInputElement).value )} className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-lg transition-colors">Caută</button>
                </div>
            )}
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            {history.length > 0 && !currentProduct && !isLoading && !isScanning &&(
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Scanate Recent</h3>
                    <div className="space-y-2">
                        {history.map(item => (
                            <div key={item.barcode} onClick={() => fetchProductData(item.barcode)} className="card p-3 flex items-center gap-4 cursor-pointer">
                                <img src={item.image || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=N/A'} alt={item.name || 'Produs'} className="w-12 h-12 rounded-lg object-contain bg-slate-100 dark:bg-slate-700" />
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex-1">{item.name || 'Produs Necunoscut'}</p>
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">arrow_forward_ios</span>
                            </div>
                        ))}
                    </div>
                     <hr className="my-6 border-slate-200 dark:border-slate-700" />
                </div>
            )}

            {currentProduct && !isLoading && !error && (
                <div className="space-y-6 fade-in">
                    <div className="card text-center relative">
                         <button onClick={() => handleAddToCompare(currentProduct)} disabled={comparisonList.length >= 2 || !!comparisonList.find(p => p.code === currentProduct.code)} className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-2 rounded-full transition-colors" title="Compară">
                            <span className="material-symbols-outlined">compare_arrows</span>
                        </button>
                        <img src={currentProduct.image_front_url || currentProduct.image_url || 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Fără+Imagine'} alt={currentProduct.product_name} className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg bg-white p-2 border"/>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{currentProduct.product_name_ro || currentProduct.product_name}</h2>
                        <p className="text-base text-slate-500 dark:text-slate-400">{currentProduct.brands}</p>
                    </div>

                    <div className="card space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center"><span className="material-symbols-outlined mr-3 text-violet-500">auto_awesome</span>Analiză AI</h3>
                        <button onClick={() => handleGeminiRequest('isGoodForMe')} className="w-full flex items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-violet-300 shadow-md">
                            <span className="material-symbols-outlined mr-2">person_check</span>Este bun pentru mine?
                        </button>
                        {personalizedResult && !isPersonalizedLoading && <AnalysisResult result={personalizedResult} />}
                        {isPersonalizedLoading && <Loader text="Se analizează..." size="h-8 w-8" />}
                        {personalizedError && <p className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">{personalizedError}</p>}

                        {!product?.isCosmetic && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button onClick={() => handleGeminiRequest('alternatives')} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-sm">Alternative</button>
                                <button onClick={() => handleGeminiRequest('mealIdea')} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-sm">Idee Masă</button>
                                <button onClick={() => handleGeminiRequest('homeMade')} className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-sm">Home-Made</button>
                            </div>
                        )}
                        {geminiResult !== null && (
                             <div className="mt-4 prose prose-sm dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div dangerouslySetInnerHTML={parseMarkdown(geminiResult, isStreaming)} />
                            </div>
                        )}
                    </div>

                    {!product?.isCosmetic && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <ScoreCard title="Nutri-Score" value={nutriScore} desc="Calitate nutrițională">
                                <div className={`text-3xl font-extrabold ${nutriScoreColors[nutriScore] || 'bg-slate-300'} text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto shadow-md`}>{nutriScore}</div>
                            </ScoreCard>
                            <ScoreCard title="Grup NOVA" value={novaGroup} desc="Nivel de procesare">
                                <div className={`text-3xl font-extrabold ${novaColors[novaGroup as any] || 'bg-slate-300'} text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto shadow-md`}>{novaGroup || '?'}</div>
                            </ScoreCard>
                            <ScoreCard title="Scor Expert" value={expertScore} desc="Evaluare generală">
                                <div className={`text-3xl font-extrabold ${expertScoreColor} text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg border-4 border-white dark:border-slate-700`}>{expertScore}<span className="text-base font-normal">/10</span></div>
                            </ScoreCard>
                        </div>
                    )}

                    <div className="card space-y-6">
                        <SectionHeader icon="info" title="Detalii Produs" />
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            {product?.quantity && <div><strong className="font-semibold">Cantitate:</strong> {product.quantity}</div>}
                            {product?.categories && <div><strong className="font-semibold">Categorii:</strong> {product.categories.replace(/en:|fr:|ro:/g, ' ')}</div>}
                            {product?.labels && <div><strong className="font-semibold">Etichete:</strong> {product.labels}</div>}
                            {product?.stores && <div><strong className="font-semibold">Magazine:</strong> {product.stores}</div>}
                        </div>
                        
                        {product?.nutrient_levels && Object.keys(product.nutrient_levels).length > 0 && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>
                                <SectionHeader icon="rule" title="Niveluri de Nutrienți" />
                                <div className="space-y-2">
                                    {[
                                        { k: 'fat', l: 'Grăsimi' },
                                        { k: 'salt', l: 'Sare' },
                                        { k: 'saturated-fat', l: 'Grăsimi saturate' },
                                        { k: 'sugars', l: 'Zaharuri' }
                                    ].map(item => {
                                        const level = nutrientLevels[item.k as keyof typeof nutrientLevels];
                                        if (!level) return null;
                                        const colors = { low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
                                        const labels = { low: 'Scăzut', moderate: 'Moderat', high: 'Ridicat' };
                                        return (
                                            <div key={item.k} className="flex justify-between items-center py-1 text-sm">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.l}</span>
                                                <span className={`font-medium px-2.5 py-0.5 rounded-full ${colors[level]}`}>{labels[level]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                         {(product?.additives_tags?.length || 0) > 0 && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>
                                <SectionHeader icon="biotech" title="Aditivi & Urme" />
                                {product?.additives_tags && product.additives_tags.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Aditivi</h4>
                                        <div className="flex flex-wrap">
                                            {product.additives_tags.map(a => (
                                                <AdditiveChip key={a} name={a.replace(/ro:|en:/g, ' ').trim()} onClick={() => handleAdditiveClick(a)} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {additiveInfo && (
                                    <div className="relative p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-4">
                                        <button onClick={() => setAdditiveInfo(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"><span className="material-symbols-outlined !text-sm">close</span></button>
                                        <h5 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm mb-1">{additiveInfo.name}</h5>
                                        {additiveInfo.isLoading ? <div className="animate-pulse h-4 bg-indigo-200 dark:bg-indigo-700 rounded w-3/4"></div> : <p className="text-sm text-slate-700 dark:text-slate-300">{additiveInfo.content}</p>}
                                    </div>
                                )}
                                {product?.traces_tags && product.traces_tags.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Poate conține (urme)</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {product.traces_tags.map(a => <span key={a} className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-medium px-3 py-1 rounded-full capitalize">{a.split(':').pop()?.replace(/-/g, ' ')}</span>)}
                                        </div>
                                    </div>
                                )}
                            </>
                         )}
                        
                         {product?.ecoscore_grade && (
                            <>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>
                                <SectionHeader icon="eco" title="Impact Ecologic" />
                                {(() => {
                                    const score = (product.ecoscore_grade || 'unknown').toUpperCase();
                                    const ecoColors: any = { 'A': 'bg-emerald-100 border-emerald-300 text-emerald-800', 'B': 'bg-lime-100 border-lime-300 text-lime-800', 'C': 'bg-yellow-100 border-yellow-300 text-yellow-800', 'D': 'bg-orange-100 border-orange-300 text-orange-800', 'E': 'bg-red-100 border-red-300 text-red-800' };
                                    const style = ecoColors[score] || 'bg-slate-200 border-slate-300 text-slate-800';
                                    return (
                                        <div className={`p-4 rounded-lg flex items-center gap-5 border ${style}`}>
                                            <div className="text-4xl font-extrabold">{score}</div>
                                            <div>
                                                <div className="font-bold text-lg">Eco-Score {score}</div>
                                                <p className="text-sm opacity-80">Impactul ecologic al produsului.</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                         )}
                    </div>
                    
                    {!product?.isCosmetic && (
                        <>
                            <div className="card">
                                <SectionHeader icon="traffic" title="Etichete Semafor" subtitle="(per 100g)" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    <TrafficLight name="Grăsimi" value={nutriments.fat_100g} type="fat" />
                                    <TrafficLight name="Grăsimi Sat." value={nutriments['saturated-fat_100g']} type="saturated-fat" />
                                    <TrafficLight name="Zaharuri" value={nutriments.sugars_100g} type="sugars" />
                                    <TrafficLight name="Sare" value={nutriments.salt_100g} type="salt" />
                                </div>
                            </div>

                            <div className="card">
                                <SectionHeader icon="battery_horiz_075" title="Bateria NutrInform" subtitle={`(per porție: ${servingSize})`} />
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 pt-4">
                                    <NutrInformBattery name="Energie" value={getNutrientForServing('energy')} daily={8400} unit="kJ" />
                                    <NutrInformBattery name="Grăsimi" value={getNutrientForServing('fat')} daily={70} unit="g" />
                                    <NutrInformBattery name="Saturate" value={getNutrientForServing('saturated-fat')} daily={20} unit="g" />
                                    <NutrInformBattery name="Zaharuri" value={getNutrientForServing('sugars')} daily={90} unit="g" />
                                    <NutrInformBattery name="Sare" value={getNutrientForServing('salt')} daily={6} unit="g" />
                                </div>
                            </div>

                            <div className="card">
                                <SectionHeader icon="table_chart" title="Informații Nutriționale" />
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm mt-2">
                                        <thead>
                                            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                                <th className="py-2 font-semibold text-slate-800 dark:text-slate-200">Nutrient</th>
                                                <th className="py-2 text-right font-semibold text-slate-800 dark:text-slate-200">Per 100g</th>
                                                <th className="py-2 text-right font-semibold text-slate-800 dark:text-slate-200">Per Porție</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <NutritionRow label="Energie (kJ)" g={nutriments.energy_100g} s={nutriments.energy_serving} unit="kJ" precision={0} />
                                            <NutritionRow label="Energie (kcal)" g={nutriments['energy-kcal_100g']} s={nutriments['energy-kcal_serving']} unit="kcal" precision={0} />
                                            <NutritionRow label="Grăsimi" g={nutriments.fat_100g} s={nutriments.fat_serving} unit="g" />
                                            <NutritionRow label="Grăsimi Saturate" g={nutriments['saturated-fat_100g']} s={nutriments['saturated-fat_serving']} unit="g" />
                                            <NutritionRow label="Carbohidrați" g={nutriments.carbohydrates_100g} s={nutriments.carbohydrates_serving} unit="g" />
                                            <NutritionRow label="Zaharuri" g={nutriments.sugars_100g} s={nutriments.sugars_serving} unit="g" />
                                            <NutritionRow label="Fibre" g={nutriments.fiber_100g} s={nutriments.fiber_serving} unit="g" />
                                            <NutritionRow label="Proteine" g={nutriments.proteins_100g} s={nutriments.proteins_serving} unit="g" />
                                            <NutritionRow label="Sare" g={nutriments.salt_100g} s={nutriments.salt_serving} unit="g" precision={2} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="card">
                         <SectionHeader icon="science" title="Ingrediente" />
                         <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                             {product?.ingredients_text_ro || product?.ingredients_text || product?.ingredients_text_with_allergens || 'Lista de ingrediente nu este disponibilă.'}
                         </div>
                         <button onClick={handleAnalyzeIngredients} disabled={isIngredientsAnalyzing || (!product?.ingredients_text && !product?.ingredients_text_ro)} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined mr-2 text-base">{isIngredientsAnalyzing ? 'autorenew' : 'auto_awesome'}</span>
                            {isIngredientsAnalyzing ? 'Se analizează...' : `Analizează Ingredientele ${product?.isCosmetic ? 'Cosmetice' : ''}`}
                         </button>
                         {ingredientsAnalysis && (
                             <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4 prose prose-sm dark:prose-invert max-w-none">
                                 <div dangerouslySetInnerHTML={parseMarkdown(ingredientsAnalysis, isIngredientsAnalyzing)} />
                             </div>
                         )}
                    </div>
                    
                    {product?.allergens_tags && product.allergens_tags.length > 0 && (
                         <div className="card">
                             <SectionHeader icon="warning" title="Alergeni" subtitle="Conține:" />
                             <div className="flex flex-wrap gap-2">
                                 {product.allergens_tags.map(a => <span key={a} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium px-3 py-1 rounded-full capitalize">{a.split(':').pop()?.replace(/-/g, ' ')}</span>)}
                             </div>
                         </div>
                    )}
                    
                    {(product?.countries || product?.manufacturing_places) && (
                        <div className="card">
                            <SectionHeader icon="public" title="Origine & Fabricație" />
                            <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                {product.countries && <p><strong className="font-semibold">Vândut în:</strong> {product.countries.replace(/en:|ro:/g, ' ')}</p>}
                                {product.manufacturing_places && <p><strong className="font-semibold">Fabricat în:</strong> {product.manufacturing_places}</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
   };

    const renderHub = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8">
             <AnalyzerHubButton 
                icon="barcode_scanner" 
                title={t.productAnalysis} 
                description="Scanează codul de bare sau fă o poză ingredientelor pentru o analiză detaliată." 
                onClick={() => setSelectedMode('product')}
                className="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <AnalyzerHubButton 
                icon="restaurant" 
                title={t.mealAnalysis} 
                description="Fă o poză mâncării tale pentru a afla caloriile și macro-nutrienții." 
                onClick={() => setSelectedMode('meal')}
                className="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <AnalyzerHubButton 
                icon="menu_book" 
                title={t.menuAnalysis} 
                description={t.menuDescription}
                onClick={() => setSelectedMode('menu')}
                className="bg-gradient-to-br from-violet-500 to-purple-600"
            />
             <AnalyzerHubButton 
                icon="receipt_long" 
                title={t.recipeAnalysis} 
                description="Introdu un link către o rețetă pentru a vedea cât de sănătoasă este." 
                onClick={() => setSelectedMode('recipe')}
                className="bg-gradient-to-br from-orange-500 to-red-500"
            />
        </div>
    );

    const renderSelectedMode = () => {
        return (
            <div className="fade-in">
                <button onClick={() => setSelectedMode(null)} className="mb-6 flex items-center text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold">
                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                    Înapoi la Meniu
                </button>
                
                {selectedMode === 'product' && renderProductAnalyzer()}

                {selectedMode === 'meal' && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">{t.mealAnalysis}</h2>
                        <FileUpload label="Încarcă o fotografie cu masa ta" icon="add_a_photo" onFileSelect={setMealPhoto} />
                        {mealPhoto && (
                             <div className="mt-6 space-y-6">
                                <img src={`data:image/jpeg;base64,${mealPhoto.base64}`} alt="Meal" className="w-full h-64 object-cover rounded-xl shadow-md" />
                                <button onClick={handleAnalyzeMeal} disabled={isAnalyzingMeal} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center justify-center">
                                     {isAnalyzingMeal ? <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> : <span className="material-symbols-outlined mr-2">analytics</span>}
                                     {isAnalyzingMeal ? 'Se analizează...' : 'Analizează Masa'}
                                </button>
                             </div>
                        )}
                        {mealAnalysisResult && (
                            <div className="mt-8 space-y-6 animate-fadeIn">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={parseMarkdown(mealAnalysisResult.analysisText, false)} />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Calorii</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{mealAnalysisResult.nutrients.calories} kcal</p>
                                    </div>
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center border border-red-100 dark:border-red-800">
                                        <p className="text-xs text-red-600 dark:text-red-400">Proteine</p>
                                        <p className="font-bold text-red-800 dark:text-red-200">{mealAnalysisResult.nutrients.protein}g</p>
                                    </div>
                                     <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-100 dark:border-amber-800">
                                        <p className="text-xs text-amber-600 dark:text-amber-400">Carbs</p>
                                        <p className="font-bold text-amber-800 dark:text-amber-200">{mealAnalysisResult.nutrients.carbs}g</p>
                                    </div>
                                     <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg text-center border border-violet-100 dark:border-violet-800">
                                        <p className="text-xs text-violet-600 dark:text-violet-400">Grăsimi</p>
                                        <p className="font-bold text-violet-800 dark:text-violet-200">{mealAnalysisResult.nutrients.fat}g</p>
                                    </div>
                                </div>
                                <button onClick={handleOpenLogModal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined mr-2">post_add</span> {t.addToJournal}
                                </button>
                            </div>
                        )}
                        {error && selectedMode === 'meal' && <p className="mt-4 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">{error}</p>}
                    </div>
                )}

                {selectedMode === 'recipe' && (
                    <div className="card max-w-2xl mx-auto">
                         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">{t.recipeAnalysis}</h2>
                         <div className="flex gap-2">
                             <input 
                                type="url" 
                                placeholder="https://example.com/reteta-mea" 
                                value={recipeUrl}
                                onChange={e => setRecipeUrl(e.target.value)}
                                className="flex-grow p-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                             />
                             <button onClick={handleAnalyzeRecipe} disabled={isAnalyzingRecipe || !recipeUrl} className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                 {isAnalyzingRecipe ? <span className="material-symbols-outlined animate-spin">autorenew</span> : <span className="material-symbols-outlined">search</span>}
                             </button>
                         </div>
                         {recipeAnalysisResult && (
                             <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none animate-fadeIn">
                                 <div dangerouslySetInnerHTML={parseMarkdown(recipeAnalysisResult, isAnalyzingRecipe)} />
                             </div>
                         )}
                         {error && selectedMode === 'recipe' && <p className="mt-4 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">{error}</p>}
                    </div>
                )}

                {selectedMode === 'menu' && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{t.menuAnalysis}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">{t.menuDescription}</p>
                        <FileUpload label={t.uploadMenuPhoto} icon="restaurant_menu" onFileSelect={setMenuPhoto} />
                         {menuPhoto && (
                             <div className="mt-6 space-y-6">
                                <img src={`data:image/jpeg;base64,${menuPhoto.base64}`} alt="Menu" className="w-full max-h-96 object-contain rounded-xl shadow-md bg-slate-100 dark:bg-slate-700" />
                                <button onClick={handleAnalyzeMenu} disabled={isAnalyzingMenu} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-violet-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center">
                                     {isAnalyzingMenu ? <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> : <span className="material-symbols-outlined mr-2">recommend</span>}
                                     {isAnalyzingMenu ? 'Se analizează...' : t.analyzeMenuButton}
                                </button>
                             </div>
                        )}
                         {menuAnalysisResult && (
                             <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none animate-fadeIn">
                                 <div dangerouslySetInnerHTML={parseMarkdown(menuAnalysisResult, isAnalyzingMenu)} />
                             </div>
                         )}
                        {error && selectedMode === 'menu' && <p className="mt-4 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">{error}</p>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {selectedMode === null ? renderHub() : renderSelectedMode()}

            {isComparisonModalOpen && (
                <ComparisonModal 
                    product1={comparisonList[0]} 
                    product2={comparisonList[1]}
                    result={comparisonResult}
                    isLoading={isComparing}
                    onClose={() => setIsComparisonModalOpen(false)}
                />
            )}

            {isLogMealModalOpen && mealToLog && (
                <LogMealModal 
                    mealData={mealToLog}
                    onClose={() => setIsLogMealModalOpen(false)}
                    onSave={handleConfirmLogMeal}
                    language={language}
                />
            )}
        </div>
    );
};

export default Analyzer;
