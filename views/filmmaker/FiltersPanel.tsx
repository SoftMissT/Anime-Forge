import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { VIDEO_ASPECT_RATIOS, VIDEO_RESOLUTIONS } from '../../constants';
import type { FilmmakerFiltersState } from '../FilmmakerInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: FilmmakerFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FilmmakerFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof FilmmakerFiltersState>(key: K, value: FilmmakerFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Estúdio do Cineasta</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Prompt da Cena"
                    placeholder="Ex: Um espadachim correndo por uma floresta de bambu à noite, com a lua cheia brilhando..."
                    rows={8}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Configurações de Vídeo" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Proporção"
                           options={VIDEO_ASPECT_RATIOS}
                           value={filters.aspectRatio?.value as string}
                           onChange={(val) => updateFilter('aspectRatio', VIDEO_ASPECT_RATIOS.find(o => o.value === val) || null)}
                        />
                        <Select
                            label="Resolução"
                            options={VIDEO_RESOLUTIONS}
                            value={filters.resolution?.value as string}
                            onChange={(val) => updateFilter('resolution', VIDEO_RESOLUTIONS.find(o => o.value === val) || null)}
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
                    {isLoading ? 'Renderizando...' : 'Gerar Vídeo'}
                </Button>
            </div>
        </aside>
    );
};