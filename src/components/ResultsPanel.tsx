import React, { useState } from 'react';
import type { GeneratedItem } from '../types';
import { ForgeLoadingIndicator } from './ForgeLoadingIndicator';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { TrashIcon, GridIcon, ListIcon } from './icons';
import { AnvilIcon } from './icons/AnvilIcon';
import { ResultsTable } from './ResultsTable';
import { LazyResultCard } from './LazyResultCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsPanelProps {
  history: GeneratedItem[];
  favorites: GeneratedItem[];
  onSelect: (item: GeneratedItem) => void;
  onToggleFavorite: (item: GeneratedItem) => void;
  isLoading: boolean;
  loadingContext?: any;
  onClearHistory: () => void;
  selectedItem: GeneratedItem | null;
  onDeleteItem: (id: string) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  history,
  favorites,
  onSelect,
  onToggleFavorite,
  isLoading,
  loadingContext,
  onClearHistory,
  selectedItem,
  onDeleteItem,
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const showEmptyState = !isLoading && history.length === 0;

    const welcomeMessage = (
        <div className="text-center text-gray-400 p-8 h-full flex flex-col justify-center items-center">
            <AnvilIcon className="w-24 h-24 mx-auto mb-6 text-gray-700" />
            <h2 className="text-2xl font-bold font-japanese mb-2 text-white">
              A forja aguarda seu comando
            </h2>
            <p>Configure os filtros e clique em "Forjar Lenda" para criar seu primeiro item.</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center flex-shrink-0 mb-4 px-2">
                 <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-japanese text-text-primary">Criações Recentes</h2>
                    <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
                        <Tooltip text="Visão em Grade">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                                <GridIcon className="w-5 h-5"/>
                            </button>
                        </Tooltip>
                         <Tooltip text="Visão em Lista">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                                <ListIcon className="w-5 h-5"/>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <Tooltip text="Limpar Histórico">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearHistory}
                            disabled={history.length === 0}
                            className="!p-2"
                            aria-label="Limpar histórico de criações"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </Tooltip>
            </div>
            
            <div className="flex-grow min-h-0">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <ForgeLoadingIndicator activeFilters={loadingContext?.filters} />
                        </motion.div>
                    ) : showEmptyState ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full"
                        >
                            {welcomeMessage}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            className="h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            {viewMode === 'list' ? (
                                <div className="w-full h-full overflow-y-auto inner-scroll table-scroll-container rounded-lg border border-[var(--border-color)]">
                                    <ResultsTable
                                        history={history}
                                        favorites={favorites}
                                        onSelect={onSelect}
                                        onToggleFavorite={onToggleFavorite}
                                        selectedItem={selectedItem}
                                        onDeleteItem={onDeleteItem}
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-fluid-card gap-4 overflow-y-auto inner-scroll h-full p-1">
                                    {history.map(item => (
                                        <LazyResultCard
                                            key={item.id}
                                            item={item}
                                            onSelect={onSelect}
                                            isFavorite={favorites.some(fav => fav.id === item.id)}
                                            onToggleFavorite={onToggleFavorite}
                                            isSelected={selectedItem?.id === item.id}
                                            onDelete={onDeleteItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
