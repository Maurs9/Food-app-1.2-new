import React from 'react';
import Loader from './Loader';
import { AiModalData } from '../types';

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

interface AiModalProps {
    data: AiModalData;
    onClose: () => void;
}

const AiModal: React.FC<AiModalProps> = ({ data, onClose }) => {
    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                    <span className="material-symbols-outlined mr-3 text-sky-500 dark:text-sky-400">{data.icon}</span>{data.title}
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto">
                    {data.isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader text="Se încarcă..." />
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={parseMarkdown(data.content, !!data.isStreaming)} />
                    )}
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={onClose} className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors">Închide</button>
                </div>
            </div>
        </div>
    );
};

export default AiModal;