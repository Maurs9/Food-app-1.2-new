
import React, { useState } from 'react';
import { DietaryProfile } from '../types';
import { translations, Language } from '../translations';

interface ProfileModalProps {
    profile: DietaryProfile;
    onClose: () => void;
    onSave: (newProfile: DietaryProfile) => void;
    language: Language;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onSave, language }) => {
    const t = translations[language].profileModal;
    const { allergens, preferences } = translations[language];

    const [currentAllergies, setCurrentAllergies] = useState<string[]>(profile.allergies);
    const [currentPreferences, setCurrentPreferences] = useState<string[]>(profile.preferences);
    
    const [biometrics, setBiometrics] = useState({
        age: profile.age,
        gender: profile.gender || 'male',
        weight: profile.weight,
        height: profile.height,
        activityLevel: profile.activityLevel || 'sedentary'
    });

    const [goals, setGoals] = useState({
        calorieGoal: profile.calorieGoal || 2000,
        proteinGoal: profile.proteinGoal || 100,
        carbGoal: profile.carbGoal || 250,
        fatGoal: profile.fatGoal || 70,
    });

    const handleAllergyChange = (allergen: string) => {
        setCurrentAllergies(prev => 
            prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
        );
    };

    const handlePreferenceChange = (preference: string) => {
        setCurrentPreferences(prev =>
            prev.includes(preference) ? prev.filter(p => p !== preference) : [...prev, preference]
        );
    };

    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGoals(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    };

    const handleBiometricChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBiometrics(prev => ({ ...prev, [name]: name === 'gender' || name === 'activityLevel' ? value : Number(value) }));
    };

    const calculateGoals = () => {
        const { age, gender, weight, height, activityLevel } = biometrics;
        if (!age || !weight || !height) return;

        // Mifflin-St Jeor Equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr += gender === 'male' ? 5 : -161;

        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const tdee = Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);

        // Standard macro split: 30% P, 35% C, 35% F (Adjustable logic can be added)
        const p = Math.round((tdee * 0.30) / 4);
        const c = Math.round((tdee * 0.35) / 4);
        const f = Math.round((tdee * 0.35) / 9);

        setGoals({
            calorieGoal: tdee,
            proteinGoal: p,
            carbGoal: c,
            fatGoal: f
        });
    };
    
    const handleSave = () => {
        onSave({ 
            allergies: currentAllergies, 
            preferences: currentPreferences,
            ...biometrics,
            ...goals
        });
    };

    const Checkbox: React.FC<{ value: string, label: string, isChecked: boolean, onChange: (value: string) => void }> = ({ value, label, isChecked, onChange }) => (
         <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" value={value} checked={isChecked} onChange={() => onChange(value)} className="sr-only" />
            <span className={`w-5 h-5 border-2 rounded-md flex items-center justify-center text-white transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-500'}`}>
                <span className={`material-symbols-outlined text-sm transform transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`}>check</span>
            </span>
            <span className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </label>
    );

    const GoalInput: React.FC<{ label: string, name: keyof typeof goals, value: number, unit: string }> = ({ label, name, value, unit }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <div className="relative mt-1">
                <input
                    type="number"
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleGoalChange}
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
            <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                         <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t.biometricsTitle}</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.gender}</label>
                                    <select name="gender" value={biometrics.gender} onChange={handleBiometricChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                                        <option value="male">{t.male}</option>
                                        <option value="female">{t.female}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.age}</label>
                                    <input type="number" name="age" value={biometrics.age || ''} onChange={handleBiometricChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.weight}</label>
                                    <input type="number" name="weight" value={biometrics.weight || ''} onChange={handleBiometricChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.height}</label>
                                    <input type="number" name="height" value={biometrics.height || ''} onChange={handleBiometricChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.activity}</label>
                                    <select name="activityLevel" value={biometrics.activityLevel} onChange={handleBiometricChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                                        <option value="sedentary">{t.sedentary}</option>
                                        <option value="light">{t.light}</option>
                                        <option value="moderate">{t.moderate}</option>
                                        <option value="active">{t.active}</option>
                                        <option value="very_active">{t.very_active}</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={calculateGoals} className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined mr-2">calculate</span> {t.calculate}
                            </button>
                        </div>
                        <hr className="dark:border-slate-600" />
                        <div>
                             <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t.goalsTitle}</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <GoalInput label={t.calories} name="calorieGoal" value={goals.calorieGoal} unit="kcal" />
                                <GoalInput label={t.protein} name="proteinGoal" value={goals.proteinGoal} unit="g" />
                                <GoalInput label={t.carbs} name="carbGoal" value={goals.carbGoal} unit="g" />
                                <GoalInput label={t.fats} name="fatGoal" value={goals.fatGoal} unit="g" />
                             </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t.allergiesTitle}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {Object.entries(allergens).map(([key, label]) => (
                                    <Checkbox key={key} value={key} label={label} isChecked={currentAllergies.includes(key)} onChange={handleAllergyChange} />
                                ))}
                            </div>
                        </div>
                        <hr className="dark:border-slate-600" />
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{t.preferencesTitle}</h3>
                            <div className="space-y-3">
                                {Object.entries(preferences).map(([key, label]) => (
                                    <Checkbox key={key} value={key} label={label} isChecked={currentPreferences.includes(key)} onChange={handlePreferenceChange} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors">{t.cancel}</button>
                    <button onClick={handleSave} className="py-2 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors">{t.save}</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;