import React from 'react';
import { PersonalizedAnalysisResult } from '../types';

interface AnalysisResultProps {
    result: PersonalizedAnalysisResult;
}

const getVerdictConfig = (verdict: PersonalizedAnalysisResult['verdict']) => {
    switch (verdict) {
        case 'RECOMANDAT':
            return {
                icon: 'check_circle',
                color: 'green',
                text: 'Recomandat'
            };
        case 'CU PRECAUȚIE':
            return {
                icon: 'warning',
                color: 'amber',
                text: 'Cu Precauție'
            };
        case 'NERECOMANDAT':
            return {
                icon: 'cancel',
                color: 'red',
                text: 'Nerecomandat'
            };
        default:
            return {
                icon: 'help',
                color: 'slate',
                text: 'Analiză'
            };
    }
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
    const config = getVerdictConfig(result.verdict);

    const colors = {
        bg: `bg-${config.color}-100 dark:bg-${config.color}-900/20`,
        border: `border-${config.color}-500`,
        text: `text-${config.color}-800 dark:text-${config.color}-200`,
        icon: `text-${config.color}-500 dark:text-${config.color}-400`,
    };

    return (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${colors.bg} ${colors.border}`}>
            <div className="flex items-center">
                <span className={`material-symbols-outlined mr-3 ${colors.icon}`}>{config.icon}</span>
                <h4 className={`text-lg font-bold ${colors.text}`}>{config.text}</h4>
            </div>
            <p className={`mt-2 text-sm ${colors.text}`}>{result.summary}</p>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {result.pros && result.pros.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-green-700 dark:text-green-400 flex items-center mb-1">
                            <span className="material-symbols-outlined !text-base mr-1">add_circle</span>
                            Argumente Pro
                        </h5>
                        <ul className="space-y-1">
                           {result.pros.map((pro, index) => <li key={`pro-${index}`} className="flex items-start"><span className="text-green-600 dark:text-green-400 mr-2 mt-1">•</span><span className="flex-1 text-slate-700 dark:text-slate-300">{pro}</span></li>)}
                        </ul>
                    </div>
                )}
                 {result.cons && result.cons.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-red-700 dark:text-red-400 flex items-center mb-1">
                             <span className="material-symbols-outlined !text-base mr-1">remove_circle</span>
                            Argumente Contra
                        </h5>
                        <ul className="space-y-1">
                             {result.cons.map((con, index) => <li key={`con-${index}`} className="flex items-start"><span className="text-red-600 dark:text-red-400 mr-2 mt-1">•</span><span className="flex-1 text-slate-700 dark:text-slate-300">{con}</span></li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnalysisResult;