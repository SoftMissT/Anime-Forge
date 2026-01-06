

import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';
import type { HistoryItem, GeneratedItem, AppView } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ForgeIcon } from './icons/ForgeIcon';
import { VirtualizedList } from './ui/VirtualizedList';
import { getRarityStyles } from '../lib/styleUtils';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
}

const HistoryListItem: React.FC<{ item: HistoryItem; onSelect: (item: HistoryItem) => void; onDelete: (id: string) => void; }> = ({ item, onSelect, onDelete }) => {
    const name = item.nome || item.title;
    const createdAt = new Date(item.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors group h-full">
            <button onClick={() => onSelect(item)} className="flex-grow text-left flex items-start gap-4 min-w-0 h-full">
                 <div className="flex-shrink-0 mt-1">
                    <ForgeIcon className="w-5 h-5 text-indigo-400"/>
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <div className="flex items-center gap-2 text-xs mt-1 flex-wrap">
                        {item.categoria && <span className="bg-gray-700/80 text-gray-300 px-1.5 py-0.5 rounded-md">{item.categoria}</span>}
                        {item.raridade && 
                            <span 
                                className="font-medium px-1.5 py-0.5 rounded-md" 
                                style={getRarityStyles(item.raridade)}
                            >
                                {item.raridade}
                            </span>}
                        {('nivel_sugerido' in item && item.nivel_sugerido) && <span className="text-gray-400">Nível {item.nivel_sugerido}</span>}
                    </div>
                </div>
            </button>
            <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                <span className="text-xs text-gray-500 hidden sm:block">{createdAt}</span>
                <Button variant="ghost" className="!p-2 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                    <TrashIcon className="w-5 h-5 text-red-500" />
                </Button>
            </div>
        </div>
    );
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onDelete, onClear }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2 w-96 max-w-sm bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden origin-top-right"
                    style={{ height: 'clamp(300px, 60vh, 500px)' }}
                >
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                        <h3 className="font-bold text-white font-gangofthree text-lg">Histórico - Forja</h3>
                    </div>

                    {history.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-6">
                            <p>Nenhum item no histórico.</p>
                        </div>
                    ) : (
                        <div className="flex-grow p-2 overflow-hidden">
                            <VirtualizedList
                                items={history}
                                renderItem={(item) => <HistoryListItem item={item} onSelect={onSelect} onDelete={onDelete} />}
                                itemHeight={76}
                            />
                        </div>
                    )}
                     <div className="p-4 border-t border-gray-700 flex-shrink-0">
                        <Button variant="danger" onClick={onClear} disabled={history.length === 0} className="w-full">
                            <TrashIcon className="w-5 h-5" />
                            Limpar Histórico
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};