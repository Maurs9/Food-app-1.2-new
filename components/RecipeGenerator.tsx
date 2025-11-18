
import React, { useState, useEffect } from 'react';
import * as aiService from '../services/aiService';
import Loader from './Loader';

const parseMarkdown = (text: string | undefined | null, isStreaming: boolean) => {
    if (!text) return { __html: '' };
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3 class="text-xl font-bold my-4 text-slate-800 dark:text-slate-100">$1</h3>')
        .replace(/(\n|^)\s*[-*]\s/g, '$1<br>• ')
        .replace(/\n/g, '<br />');
    if (isStreaming) {
        html += '<span class="streaming-cursor"></span>';
    }
    return { __html: html };
}

const RecipeGenerator: React.FC = () => {
    const [ingredients, setIngredients] = useState('');
    const [mealType, setMealType] = useState('any');
    const [dietaryStyle, setDietaryStyle] = useState('any');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);

    const handleGenerate = async () => {
        if (!ingredients.trim()) {
            setError('Te rog introdu cel puțin un ingredient.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const stream = await aiService.generateRecipesFromIngredientsStream(ingredients, mealType, dietaryStyle);
            for await (const chunk of stream) {
                setResult(prev => (prev || '') + chunk);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare la generarea rețetelor.';
            setError(errorMessage);
            setResult(null); // Clear partial results on error
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleVoiceInput = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Browserul tău nu suportă recunoaștere vocală.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ro-RO';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setIngredients(prev => prev ? `${prev}, ${transcript}` : transcript);
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const isButtonDisabled = isLoading || !ingredients.trim();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Generator de Rețete</h2>
                <p className="text-slate-500 dark:text-slate-400">Ce ai în frigider? Spune-ne ingredientele și noi îți dăm idei!</p>
            </div>

            <div className="card space-y-4">
                <div>
                    <label htmlFor="ingredients" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        Ingrediente Disponibile
                    </label>
                    <div className="relative">
                        <textarea
                            id="ingredients"
                            rows={3}
                            value={ingredients}
                            onChange={e => setIngredients(e.target.value)}
                            placeholder="Ex: piept de pui, orez, broccoli, ceapă, sos de soia"
                            className="w-full p-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        />
                        {ingredients && (
                            <button
                                onClick={() => setIngredients('')}
                                className="absolute top-2 right-2 p-1 bg-slate-200 dark:bg-slate-600 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                title="Șterge tot"
                            >
                                <span className="material-symbols-outlined !text-sm">close</span>
                            </button>
                        )}
                        <button
                            onClick={toggleVoiceInput}
                            className={`absolute right-2 bottom-2 p-2 rounded-full transition-all duration-300 shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300' : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500'}`}
                            title="Adaugă prin voce"
                        >
                            <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="mealType" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Tipul Mesei (Opțional)</label>
                        <select
                            id="mealType"
                            value={mealType}
                            onChange={e => setMealType(e.target.value)}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700"
                        >
                            <option value="any">Oricare</option>
                            <option value="Mic Dejun">Mic Dejun</option>
                            <option value="Prânz">Prânz</option>
                            <option value="Cină">Cină</option>
                            <option value="Gustare">Gustare</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="dietaryStyle" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Stil Dietetic (Opțional)</label>
                        <select
                            id="dietaryStyle"
                            value={dietaryStyle}
                            onChange={e => setDietaryStyle(e.target.value)}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700"
                        >
                            <option value="any">Oricare</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Fără Gluten">Fără Gluten</option>
                             <option value="Sărac în calorii">Sărac în calorii</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isButtonDisabled}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold text-lg py-4 px-4 rounded-xl transition-all transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    <span className="material-symbols-outlined mr-2">magic_button</span>
                    {isLoading ? 'Se generează...' : 'Generează Rețete'}
                </button>
            </div>
            
            {error && (
                 <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-md" role="alert">
                    <p className="font-bold">A apărut o eroare</p>
                    <p>{error}</p>
                </div>
            )}

            {isLoading && !result && <Loader text="Bucătarul AI se gândește..." />}

            {result !== null && (
                 <div className="card">
                     <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={parseMarkdown(result, isLoading)} />
                     </div>
                 </div>
            )}
        </div>
    );
};

export default RecipeGenerator;
