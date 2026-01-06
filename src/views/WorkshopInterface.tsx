// src/views/WorkshopInterface.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useForge, useAppCore, useAuth } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { AuthOverlay } from '../components/AuthOverlay';
import { analytics } from '../lib/analytics';
import type { GeneratedItem, Category } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Button } from '../components/ui/Button';
import { FilterIcon } from '../components/icons';
import { Modal } from '../components/ui/Modal';
import { HeroBanner } from '../components/HeroBanner';

interface WorkshopInterfaceProps {
    initialCategory?: Category;
    allowedCategories?: Category[];
}

export const WorkshopInterface: React.FC<WorkshopInterfaceProps> = ({ 
    initialCategory = 'Arma', 
    allowedCategories = ['Arma', 'Acessório'] 
}) => {
    const {
        filters, handleFilterChange, resetFilters, history, addHistoryItem, deleteHistoryItem,
        clearHistory, favorites, toggleFavorite, selectedItem, setSelectedItem,
    } = useForge();
    const { loadingState, setLoadingState, setAppError } = useAppCore();
    const { isAuthenticated, handleLoginClick, user } = useAuth();
    
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        resetFilters();
        handleFilterChange('category', initialCategory);
    }, [initialCategory, handleFilterChange, resetFilters]);
    
    const handleGenerate = useCallback(async () => {
        if (!user) {
            setAppError({ message: "Autenticação necessária para gerar." });
            return;
        }

        setLoadingState({ active: true, content: 'forge', context: { filters } });
        const startTime = Date.now();
        
        try {
            const newItem = await orchestrateGeneration(filters, filters.promptModifier);

            addHistoryItem(newItem);
            setSelectedItem(newItem);
            
            if (newItem._validation?.warnings?.length) {
                setAppError({
                    type: 'warning',
                    message: "Geração Concluída com Avisos",
                    details: newItem._validation.warnings,
                });
            }
            
            analytics.trackGeneration(filters.category, true, Date.now() - startTime);
        } catch (error: any) {
            console.error("Generation failed:", error);
            setAppError({ message: `Falha na Geração|${error.message}`, canRetry: true, onRetry: handleGenerate });
            analytics.trackGeneration(filters.category, false, Date.now() - startTime);
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, user, addHistoryItem, setSelectedItem, setLoadingState, setAppError]);
    
    const handleSelect = useCallback((item: GeneratedItem) => {
        setSelectedItem(item);
    }, [setSelectedItem]);
    
    const handleToggleFavorite = useCallback((item: GeneratedItem) => {
        toggleFavorite(item);
    }, [toggleFavorite]);
    
    const handleDelete = useCallback(async (id: string) => {
        if (window.confirm('Deletar este item do histórico? A ação não pode ser desfeita.')) {
            deleteHistoryItem(id);
            if (selectedItem?.id === id) {
                setSelectedItem(history[0] || null);
            }
        }
    }, [deleteHistoryItem, selectedItem, history, setSelectedItem]);
    
    const handleClear = useCallback(async () => {
        if (window.confirm('Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            clearHistory();
            setSelectedItem(null);
        }
    }, [clearHistory, setSelectedItem]);
    
    const filterPanelComponent = (
        <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onGenerate={() => {
                handleGenerate();
                if (isMobile) setIsFilterModalOpen(false);
            }}
            onReset={resetFilters}
            isLoading={loadingState.active && loadingState.content === 'forge'}
            allowedCategories={allowedCategories}
        />
    );

    return (
        <div className="relative w-full h-full flex flex-col gap-6 p-6">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso à Forja Secreta" />}

            <div className="flex-shrink-0">
               <HeroBanner />
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {isMobile ? (
                    <Modal
                        isOpen={isFilterModalOpen}
                        onClose={() => setIsFilterModalOpen(false)}
                        panelClassName="!w-[480px] max-w-[90vw]"
                        variant="drawer-left"
                    >
                        {filterPanelComponent}
                    </Modal>
                ) : (
                    <aside className="w-[420px] flex-shrink-0 h-full">
                        {filterPanelComponent}
                    </aside>
                )}
                
                <main className="flex-1 h-full flex flex-col min-h-0">
                     {isMobile && (
                         <Button
                             onClick={() => setIsFilterModalOpen(true)}
                             className="w-full mb-4 flex-shrink-0"
                             size="lg"
                         >
                             <FilterIcon className="w-5 h-5" />
                             Configurar Forja
                         </Button>
                     )}
                     <div className="flex-grow min-h-0">
                        <ResultsPanel
                            history={history}
                            favorites={favorites}
                            onSelect={handleSelect}
                            onToggleFavorite={handleToggleFavorite}
                            isLoading={loadingState.active && loadingState.content === 'forge'}
                            loadingContext={loadingState.context}
                            onClearHistory={handleClear}
                            selectedItem={selectedItem}
                            onDeleteItem={handleDelete}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};
