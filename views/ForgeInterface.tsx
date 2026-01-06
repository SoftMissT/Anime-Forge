import React, { useCallback, useState, useEffect } from 'react';
// FIX: Changed useCoreUI to useAppCore
import { useAppCore } from '../contexts/AppContext';
import { useForge } from '../contexts/AppContext';
import type { GeneratedItem, FilterState, Category } from '../types';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from './forge/ResultsPanel';
// FIX: Added INITIAL_FILTER_STATE to constants export
import { INITIAL_FILTER_STATE } from '../constants';

interface ForgeInterfaceProps {
    initialCategory: Category;
    allowedCategories?: Category[];
}

const ForgeInterface: React.FC<ForgeInterfaceProps> = ({ initialCategory, allowedCategories }) => {
    // FIX: Destructure setLoadingState and setAppError correctly.
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, addHistoryItem, toggleFavorite, setSelectedItem: openDetailModal } = useForge();
    const [filters, setFilters] = useState<FilterState>({...INITIAL_FILTER_STATE, category: initialCategory});
    
    useEffect(() => {
        setFilters(prev => ({...INITIAL_FILTER_STATE, category: initialCategory}));
    }, [initialCategory]);
    
    // FIX: Added handler for FilterPanel's onFilterChange
    const handleFilterChange = <K extends keyof FilterState>(field: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleForge = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    view: 'forge',
                    filters: filters,
                }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha na comunicação com a API.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const results = JSON.parse(responseText);

            const newItems: GeneratedItem[] = results.map((item: any, index: number) => ({
                id: `item-${Date.now()}-${index}`,
                // FIX: Use correct properties for GeneratedItem type
                nome: item.title,
                descricao: item.description,
                descricao_curta: item.description.substring(0, 100) + '...',
                is_favorite: false,
                categoria: filters.category,
                promptModifier: filters.promptModifier,
                createdAt: new Date().toISOString(),
                // Add dummy required fields
                raridade: 'Comum',
                nivel_sugerido: 1,
                ganchos_narrativos: [],
            }));

            // FIX: Use addHistoryItem from context instead of direct state setter
            newItems.reverse().forEach(item => addHistoryItem(item));

        } catch (e: any) {
            console.error("Erro durante a forja:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);

    const handleViewDetails = (item: GeneratedItem) => {
        openDetailModal(item);
    };
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
                <FilterPanel 
                    filters={filters}
                    // FIX: Pass onFilterChange instead of setFilters
                    onFilterChange={handleFilterChange}
                    onGenerate={handleForge}
                    isLoading={loadingState.active}
                    onReset={() => setFilters({...INITIAL_FILTER_STATE, category: initialCategory})}
                    allowedCategories={allowedCategories}
                />
            </aside>
            <ResultsPanel
                // FIX: Use 'categoria' instead of 'category'
                results={history.filter(item => allowedCategories ? allowedCategories.includes(item.categoria) : true)}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleForge}
                onViewDetails={handleViewDetails}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export { ForgeInterface };
export default ForgeInterface;