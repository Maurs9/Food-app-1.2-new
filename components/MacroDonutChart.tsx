import React, { useEffect, useState } from 'react';

interface MacroDonutChartProps {
    protein: number;
    carbs: number;
    fat: number;
    size?: number;
    strokeWidth?: number;
}

const Arc: React.FC<{
    color: string;
    radius: number;
    strokeWidth: number;
    percent: number;
    circumference: number;
    offset: number;
    size: number;
}> = ({ color, radius, strokeWidth, percent, circumference, offset, size }) => {
    const [animatedDasharray, setAnimatedDasharray] = useState(0);
    const targetDasharray = (percent / 100) * circumference;

    useEffect(() => {
        const timer = requestAnimationFrame(() => setAnimatedDasharray(targetDasharray));
        return () => cancelAnimationFrame(timer);
    }, [targetDasharray]);

    return (
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${animatedDasharray} ${circumference}`}
            strokeDashoffset={-offset}
            className={`${color} donut-arc`}
        />
    );
};

const MacroDonutChart: React.FC<MacroDonutChartProps> = ({
    protein,
    carbs,
    fat,
    size = 200,
    strokeWidth = 25
}) => {
    const totalMacros = protein + carbs + fat;

    if (totalMacros === 0) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                 <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={(size - strokeWidth) / 2}
                        fill="none"
                        stroke="#e5e7eb" // gray-200
                        strokeWidth={strokeWidth}
                        className="dark:stroke-slate-700"
                    />
                </svg>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Fără date</p>
            </div>
        );
    }


    const proteinPercent = (protein / totalMacros) * 100;
    const carbsPercent = (carbs / totalMacros) * 100;
    const fatPercent = (fat / totalMacros) * 100;

    const data = [
        { percent: proteinPercent, color: 'stroke-red-500' },
        { percent: carbsPercent, color: 'stroke-amber-500' },
        { percent: fatPercent, color: 'stroke-violet-500' },
    ];

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb" // gray-200
                        strokeWidth={strokeWidth}
                        className="dark:stroke-slate-700"
                    />
                    {data.map((item, index) => {
                        const arc = (
                           <Arc
                                key={index}
                                size={size}
                                radius={radius}
                                strokeWidth={strokeWidth}
                                color={item.color}
                                percent={item.percent}
                                circumference={circumference}
                                offset={offset}
                           />
                        );
                        offset += (item.percent / 100) * circumference;
                        return arc;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{Math.round(totalMacros)}g</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Macronutrienți</span>
                </div>
            </div>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>Proteine: {protein.toFixed(1)}g ({proteinPercent.toFixed(0)}%)</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Carbs: {carbs.toFixed(1)}g ({carbsPercent.toFixed(0)}%)</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-violet-500 mr-2"></span>Grăsimi: {fat.toFixed(1)}g ({fatPercent.toFixed(0)}%)</span>
            </div>
        </div>
    );
};

export default MacroDonutChart;