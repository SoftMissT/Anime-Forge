import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
// FIX: Import from ui barrel file
import { SearchableMultiSelect, Select } from '../../components/ui';
import { Slider } from '../../components/ui/Slider';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
import { TextInput } from '../../components/ui/TextInput';
// FIX: Added missing constants
import { CREATIVE_STYLES, DETAIL_LEVELS, FORGE_CATEGORIES } from '../../constants';
import type { FilterState as ForgeState, Category, SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: ForgeState;
    setFilters: React.Dispatch<React.SetStateAction<ForgeState>>;
    onForge: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onForge, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof ForgeState>(key: K, value: ForgeState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Forja Criativa</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                    <Button variant="secondary" size="sm">Histórico</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Descreva sua ideia"
                    placeholder="Ex: Um caçador de onis que usa a respiração da névoa e tem um passado misterioso..."
                    rows={6}
                    value={filters.promptModifier}
                    onChange={(e) => updateFilter('promptModifier', e.target.value)}
                />

                <CollapsibleSection title="Parâmetros da Forja" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Categoria"
                           options={FORGE_CATEGORIES}
                           // FIX: Select expects string value, not object
                           value={filters.category}
                           onChange={(val) => val && updateFilter('category', val as Category)}
                        />
                        <Select
                            label="Nível de Detalhe"
                            options={DETAIL_LEVELS}
                            value={(DETAIL_LEVELS[1] as SelectOption).value as string}
                            onChange={(val) => {}}
                        />
                         <Slider 
                            label="Criatividade"
                            min={0}
                            max={100}
                            step={1}
                            value={50}
                            onChange={(e) => {}}
                        />
                         <TextInput 
                            label="Palavras-chave"
                            placeholder="Ex: trágico, rápido, corvo"
                            value={""}
                            onChange={(e) => {}}
                        />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Atributos Adicionais">
                    <div className="space-y-4">
                       <SearchableMultiSelect 
                            label="Estilos"
                            options={CREATIVE_STYLES}
                            selected={[]}
                            onChange={(val) => {}}
                            placeholder="Selecione estilos..."
                       />
                       <Switch 
                            label="Incluir Elementos Canônicos"
                            checked={false}
                            onChange={(e) => {}}
                       />
                    </div>
                </CollapsibleSection>
            </div>

            <div className="p-4 mt-auto border-t border-border-color bg-bg-secondary">
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={onForge}
                    // FIX: Added isLoading prop
                    isLoading={isLoading}
                >
                    {isLoading ? 'Forjando...' : 'Forjar Ideia'}
                </Button>
            </div>
        </aside>
    );
};