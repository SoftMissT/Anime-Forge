import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { Select } from '../../components/ui/Select';
import { Slider } from '../../components/ui/Slider';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { MASTER_TOOL_TYPES, NAME_CATEGORIES, PLOT_HOOK_GENRES, ONOMATOPOEIA_TYPES } from '../../constants';
import type { MasterToolFiltersState } from '../MasterToolsInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: MasterToolFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<MasterToolFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof MasterToolFiltersState>(key: K, value: MasterToolFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    const renderContextualFilters = () => {
        switch (filters.toolType?.value) {
            case 'name_generator':
                return (
                    <Select 
                        label="Categoria do Nome"
                        options={NAME_CATEGORIES}
                        value={filters.category?.value as string}
                        onChange={(val) => updateFilter('category', NAME_CATEGORIES.find(o => o.value === val) || null)}
                    />
                );
            case 'plot_hook_generator':
                return (
                    <Select
                        label="Gênero da Trama"
                        options={PLOT_HOOK_GENRES}
                        value={filters.genre?.value as string}
                        onChange={(val) => updateFilter('genre', PLOT_HOOK_GENRES.find(o => o.value === val) || null)}
                    />
                );
            case 'onomatopoeia_generator':
                return (
                     <Select
                        label="Tipo de Som"
                        options={ONOMATOPOEIA_TYPES}
                        value={filters.soundType?.value as string}
                        onChange={(val) => updateFilter('soundType', ONOMATOPOEIA_TYPES.find(o => o.value === val) || null)}
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Oficina do Mestre</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                 <Select 
                    label="Ferramenta"
                    options={MASTER_TOOL_TYPES}
                    value={filters.toolType?.value as string}
                    onChange={(val) => updateFilter('toolType', MASTER_TOOL_TYPES.find(o => o.value === val) || null)}
                />
                
                <TextArea
                    label="Contexto / Inspiração (Opcional)"
                    placeholder="Adicione um contexto para guiar a IA..."
                    rows={4}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Opções da Ferramenta" defaultOpen>
                    <div className="space-y-4">
                        {renderContextualFilters()}
                        <Slider
                            label="Quantidade"
                            min={1}
                            max={10}
                            step={1}
                            value={filters.quantity}
                            onChange={(e) => updateFilter('quantity', parseInt(e.target.value, 10))}
                        />
                    </div>
                </CollapsibleSection>
            </div>

            <div className="p-4 mt-auto border-t border-border-color bg-bg-secondary">
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={onGenerate}
                    // FIX: Added isLoading prop
                    isLoading={isLoading}
                >
                    {isLoading ? 'Gerando...' : 'Usar Ferramenta'}
                </Button>
            </div>
        </aside>
    );
};