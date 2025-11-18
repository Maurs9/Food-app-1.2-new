import React, { useState } from 'react';

interface FileUploadProps {
    label: string;
    icon: string;
    onFileSelect: (fileData: { file: File, base64: string } | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, icon, onFileSelect }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result?.toString().split(',')[1];
                if (base64) {
                    onFileSelect({ file, base64 });
                } else {
                    onFileSelect(null);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setFileName(null);
            onFileSelect(null);
        }
    };

    return (
        <div>
            <label className="cursor-pointer border-2 dashed border-slate-300 dark:border-slate-600 p-8 rounded-lg flex flex-col items-center justify-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-400">{icon}</span>
                <span className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} capture="environment" />
            </label>
             {fileName && <span className="text-xs text-green-600 dark:text-green-400 mt-1 block text-center">{fileName}</span>}
        </div>
    );
};

export default FileUpload;