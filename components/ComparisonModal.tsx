import React from 'react';
import { Product, ComparisonResult } from '../types';
import Loader from './Loader';

interface ComparisonModalProps {
    product1: Product;
    product2: Product;
    result: ComparisonResult | null;
    isLoading: boolean;
    onClose: () => void;
}

const ProductColumn: React.FC<{ product: Product, pros: string[], cons: string[] }> = ({ product, pros, cons }) => (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
        <img src={product.image_url} alt={product.product_name} className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg bg-white p-1 border" />
        <h4 className="font-bold text-center text-slate-800 dark:text-slate-100">{product.product_name}</h4>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">{product.brands}</p>
        
        <div className="space-y-3 text-sm">
            <div>
                <h5 className="font-semibold text-green-700 dark:text-green-400 flex items-center mb-1">
                    <span className="material-symbols-outlined !text-base mr-1">add_circle</span>Pro
                </h5>
                <ul className="space-y-1 pl-2 list-disc list-inside">
                    {pros.map((pro, i) => <li key={i} className="text-slate-600 dark:text-slate-300">{pro}</li>)}
                </ul>
            </div>
             <div>
                <h5 className="font-semibold text-red-700 dark:text-red-400 flex items-center mb-1">
                    <span className="material-symbols-outlined !text-base mr-1">remove_circle</span>Contra
                </h5>
                <ul className="space-y-1 pl-2 list-disc list-inside">
                    {cons.map((con, i) => <li key={i} className="text-slate-600 dark:text-slate-300">{con}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

const NutrientRow: React.FC<{ label: string, value1?: number, value2?: number, unit: string, lowerIsBetter?: boolean }> = ({ label, value1, value2, unit, lowerIsBetter = false }) => {
    const v1 = value1 ?? 'N/A';
    const v2 = value2 ?? 'N/A';
    
    let winner = 'none';
    if (typeof value1 === 'number' && typeof value2 === 'number') {
        if (value1 < value2) winner = lowerIsBetter ? 'v1' : 'v2';
        if (value2 < value1) winner = lowerIsBetter ? 'v2' : 'v1';
    }

    const cellClass = "py-2 px-3 text-center";
    const winnerClass = "font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";

    return (
        <tr className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
            <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-200">{label}</td>
            <td className={`${cellClass} ${winner === 'v1' ? winnerClass : ''}`}>{v1 !== 'N/A' ? `${v1} ${unit}` : v1}</td>
            <td className={`${cellClass} ${winner === 'v2' ? winnerClass : ''}`}>{v2 !== 'N/A' ? `${v2} ${unit}` : v2}</td>
        </tr>
    );
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ product1, product2, result, isLoading, onClose }) => {
    
    const getWinnerConfig = () => {
        if (!result) return { text: '', color: 'slate', icon: 'compare' };
        switch(result.healthierOption) {
            case 'produsul 1': return { text: product1.product_name || 'Produs 1', color: 'green', icon: 'emoji_events' };
            case 'produsul 2': return { text: product2.product_name || 'Produs 2', color: 'green', icon: 'emoji_events' };
            case 'niciunul': return { text: 'Niciunul nu este o opțiune ideală', color: 'amber', icon: 'warning' };
            default: return { text: '', color: 'slate', icon: 'compare' };
        }
    };
    
    const winnerConfig = getWinnerConfig();

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        <span className="material-symbols-outlined mr-3 text-sky-500 dark:text-sky-400">compare_arrows</span>Comparație Produse
                    </h2>
                     <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined !text-xl">close</span>
                    </button>
                </div>

                {isLoading && <Loader text="Se compară produsele..." />}

                {result && !isLoading && (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg border-l-4 bg-${winnerConfig.color}-100 dark:bg-${winnerConfig.color}-900/20 border-${winnerConfig.color}-500 text-${winnerConfig.color}-800 dark:text-${winnerConfig.color}-200`}>
                            <h3 className="font-bold text-lg flex items-center">
                                <span className="material-symbols-outlined mr-2">{winnerConfig.icon}</span>
                                Recomandare: {winnerConfig.text}
                            </h3>
                            <p className="text-sm mt-1">{result.recommendationReason}</p>
                            <p className="text-sm mt-2 italic">{result.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProductColumn product={product1} pros={result.product1_pros} cons={result.product1_cons} />
                            <ProductColumn product={product2} pros={result.product2_pros} cons={result.product2_cons} />
                        </div>
                        
                        <div>
                           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Comparație Nutrienți (per 100g)</h3>
                           <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-700/50">
                                            <th className="py-2 px-3 text-left font-semibold text-slate-600 dark:text-slate-300 rounded-tl-lg">Nutrient</th>
                                            <th className="py-2 px-3 text-center font-semibold text-slate-600 dark:text-slate-300">{product1.product_name}</th>
                                            <th className="py-2 px-3 text-center font-semibold text-slate-600 dark:text-slate-300 rounded-tr-lg">{product2.product_name}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <NutrientRow label="Calorii" value1={product1.nutriments?.['energy-kcal_100g']} value2={product2.nutriments?.['energy-kcal_100g']} unit="kcal" lowerIsBetter />
                                        <NutrientRow label="Zaharuri" value1={product1.nutriments?.sugars_100g} value2={product2.nutriments?.sugars_100g} unit="g" lowerIsBetter />
                                        <NutrientRow label="Grăsimi" value1={product1.nutriments?.fat_100g} value2={product2.nutriments?.fat_100g} unit="g" lowerIsBetter />
                                        <NutrientRow label="Proteine" value1={product1.nutriments?.proteins_100g} value2={product2.nutriments?.proteins_100g} unit="g" />
                                        <NutrientRow label="Sare" value1={product1.nutriments?.salt_100g} value2={product2.nutriments?.salt_100g} unit="g" lowerIsBetter />
                                    </tbody>
                                </table>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonModal;