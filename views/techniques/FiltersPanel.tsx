import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { TECHNIQUE_TYPES, BASE_ELEMENTS, TECHNIQUE_COMPLEXITY } from '../../constants';
import type { TechniqueFiltersState } from '../TechniquesInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: TechniqueFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<TechniqueFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof TechniqueFiltersState>(key: K, value: TechniqueFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Forja de Técnicas</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Conceito da Técnica"
                    placeholder="Ex: Uma respiração baseada no silêncio e no frio cortante da neve..."
                    rows={6}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Fundamentos da Técnica" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Tipo de Técnica"
                           options={TECHNIQUE_TYPES}
                           value={filters.type?.value as string}
                           onChange={(val) => updateFilter('type', TECHNIQUE_TYPES.find(o => o.value === val) || null)}
                        />
                        <Select
                            label="Elemento Base"
                            options={BASE_ELEMENTS}
                            value={filters.baseElement?.value as string}
                            onChange={(val) => updateFilter('baseElement', BASE_ELEMENTS.find(o => o.value === val) || null)}
                        />
                        <Select
                            label="Complexidade / Formas"
                            options={TECHNIQUE_COMPLEXITY}
                            value={filters.complexity?.value as string}
                            onChange={(val) => updateFilter('complexity', TECHNIQUE_COMPLEXITY.find(o => o.value === val) || null)}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Detalhes Adicionais">
                    <div className="space-y-4">
                       <Switch 
                            label="Gerar Usuário Notável"
                            checked={filters.generateNotableUser}
                            // FIX: pass boolean value from event
                            onChange={(e) => updateFilter('generateNotableUser', e.target.checked)}
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
                    {isLoading ? 'Criando...' : 'Gerar Técnica'}
                </Button>
            </div>
        </aside>
    );
};