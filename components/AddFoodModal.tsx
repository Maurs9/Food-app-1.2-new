import React, { useState, useMemo } from 'react';
import { FoodItem, FoodTierName, FoodCategory } from '../types';

interface AddFoodModalProps {
    foodData: FoodCategory[];
    onClose: () => void;
    onSave: (newFood: FoodItem, categoryName: string, subcategoryName: string) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ foodData, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(foodData[0]?.name || '');
    const [selectedSubcategory, setSelectedSubcategory] = useState(foodData[0]?.subcategories[0]?.name || '');
    const [tier, setTier] = useState<FoodTierName>('C');
    const [info, setInfo] = useState('');
    const [cons, setCons] = useState('');
    const [error, setError] = useState('');

    const TIER_OPTIONS: FoodTierName[] = ['TOP', 'A', 'B', 'C', 'D', 'E'];

    const availableSubcategories = useMemo(() => {
        const category = foodData.find(c => c.name === selectedCategory);
        return category ? category.subcategories : [];
    }, [selectedCategory, foodData]);
    
    // Effect to reset subcategory when category changes
    React.useEffect(() => {
        if (availableSubcategories.length > 0) {
            setSelectedSubcategory(availableSubcategories[0].name);
        } else {
            setSelectedSubcategory('');
        }
    }, [selectedCategory, availableSubcategories]);


    const handleSave = () => {
        if (!name.trim() || !selectedCategory || !selectedSubcategory || !info.trim()) {
            setError('Numele, categoria, subcategoria și informațiile pro sunt obligatorii.');
            return;
        }
        setError('');

        const newFood: FoodItem = {
            id: Date.now().toString(),
            name: name.trim(),
            tier,
            info: info.trim(),
            cons: cons.trim() || undefined,
            isCustom: true,
        };

        onSave(newFood, selectedCategory, selectedSubcategory);
    };
    
    const isFormValid = name.trim() && selectedCategory && selectedSubcategory && info.trim();
    const inputClasses = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";


    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Adaugă un Aliment Nou</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="foodName" className={labelClasses}>Nume Aliment</label>
                        <input
                            id="foodName"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="foodCategory" className={labelClasses}>Categorie</label>
                            <select
                                id="foodCategory"
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className={inputClasses}
                            >
                                {foodData.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="foodSubcategory" className={labelClasses}>Subcategorie</label>
                            <select
                                id="foodSubcategory"
                                value={selectedSubcategory}
                                onChange={e => setSelectedSubcategory(e.target.value)}
                                className={inputClasses}
                                disabled={availableSubcategories.length === 0}
                            >
                                {availableSubcategories.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="foodTier" className={labelClasses}>Nivel (Tier)</label>
                        <select
                            id="foodTier"
                            value={tier}
                            onChange={e => setTier(e.target.value as FoodTierName)}
                            className={inputClasses}
                        >
                            {TIER_OPTIONS.map(opt => <option key={opt} value={opt}>Nivel {opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="foodInfo" className={labelClasses}>Informații Pro</label>
                        <textarea
                            id="foodInfo"
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                            rows={3}
                            className={inputClasses}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="foodCons" className={labelClasses}>Informații Contra (Opțional)</label>
                        <textarea
                            id="foodCons"
                            value={cons}
                            onChange={e => setCons(e.target.value)}
                            rows={3}
                            className={inputClasses}
                        ></textarea>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors">Anulează</button>
                    <button onClick={handleSave} disabled={!isFormValid} className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Salvează Aliment</button>
                </div>
            </div>
        </div>
    );
};

export default AddFoodModal;