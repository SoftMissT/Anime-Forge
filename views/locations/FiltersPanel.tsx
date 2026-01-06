import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { LOCATION_BIOMES, LOCATION_ATMOSPHERES } from '../../constants';
import type { LocationFiltersState } from '../LocationsInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: LocationFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<LocationFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof LocationFiltersState>(key: K, value: LocationFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Forja de Locais</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Conceito do Local"
                    placeholder="Ex: Uma antiga cidade subterrânea onde os ferreiros de Nichirin escondiam seus segredos..."
                    rows={6}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Características Geográficas" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Bioma / Ambiente"
                           options={LOCATION_BIOMES}
                           value={filters.biome?.value as string}
                           onChange={(val) => updateFilter('biome', LOCATION_BIOMES.find(o => o.value === val) || null)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Atmosfera e Detalhes" defaultOpen>
                    <div className="space-y-4">
                       <Select
                            label="Atmosfera Predominante"
                            options={LOCATION_ATMOSPHERES}
                            value={filters.atmosphere?.value as string}
                            onChange={(val) => updateFilter('atmosphere', LOCATION_ATMOSPHERES.find(o => o.value === val) || null)}
                        />
                       <Switch 
                            label="Gerar Pontos de Interesse"
                            checked={filters.generatePointsOfInterest}
                            // FIX: pass boolean value from event
                            onChange={(e) => updateFilter('generatePointsOfInterest', e.target.checked)}
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
                    {isLoading ? 'Criando...' : 'Gerar Local'}
                </Button>
            </div>
        </aside>
    );
};