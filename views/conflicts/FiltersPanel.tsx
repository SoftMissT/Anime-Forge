import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
// FIX: Import from ui barrel file
import { SearchableMultiSelect, Select } from '../../components/ui';
import { Slider } from '../../components/ui/Slider';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { CONFLICT_SCALES, CONFLICT_TYPES, FACTIONS } from '../../constants';
import type { ConflictFiltersState } from '../ConflictsInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: ConflictFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<ConflictFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof ConflictFiltersState>(key: K, value: ConflictFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    const scaleLabel = CONFLICT_SCALES.find(s => s.value === filters.scale)?.label || 'Duelo Pessoal';

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Gerador de Conflitos</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Objetivo Central da Missão"
                    placeholder="Ex: Proteger um vilarejo de um ataque iminente de onis, descobrir a fonte de desaparecimentos misteriosos..."
                    rows={6}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Parâmetros do Conflito" defaultOpen>
                    <div className="space-y-4">
                        <Slider 
                            label={`Escala: ${scaleLabel}`}
                            min={0}
                            max={100}
                            step={25}
                            value={filters.scale}
                            onChange={(e) => updateFilter('scale', parseInt(e.target.value, 10))}
                        />
                         <Select 
                           label="Tipo de Missão"
                           options={CONFLICT_TYPES}
                           value={filters.missionType?.value as string}
                           onChange={(val) => updateFilter('missionType', CONFLICT_TYPES.find(o => o.value === val) || null)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Envolvidos e Trama" defaultOpen>
                    <div className="space-y-4">
                       <SearchableMultiSelect 
                            label="Facções Envolvidas"
                            options={FACTIONS}
                            selected={filters.factions.map(f => f.value as string)}
                            onChange={(vals) => updateFilter('factions', vals.map(v => FACTIONS.find(o => o.value === v)).filter(Boolean) as SelectOption[])}
                            placeholder="Selecione as facções..."
                       />
                       <Switch 
                            label="Adicionar Reviravolta (Plot Twist)"
                            checked={filters.addPlotTwist}
                            // FIX: pass boolean value from event
                            onChange={(e) => updateFilter('addPlotTwist', e.target.checked)}
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
                    {isLoading ? 'Gerando...' : 'Gerar Conflito'}
                </Button>
            </div>
        </aside>
    );
};