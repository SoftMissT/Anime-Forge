import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
// FIX: Import from ui barrel file
import { SearchableMultiSelect, Select } from '../../components/ui';
import { Switch } from '../../components/ui/Switch';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added missing constants
import { CHARACTER_AFFILIATIONS, DEMON_RANKS, DEMON_SLAYER_RANKS, PERSONALITY_TRAITS } from '../../constants';
import type { CharacterFiltersState } from '../CharactersInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: CharacterFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<CharacterFiltersState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof CharacterFiltersState>(key: K, value: CharacterFiltersState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    const getRankOptions = (): SelectOption[] => {
        switch (filters.affiliation?.value) {
            case 'demon_slayer':
                return DEMON_SLAYER_RANKS;
            case 'demon':
                return DEMON_RANKS;
            default:
                return [];
        }
    };
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Criador de Personagens</h2>
                <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Conceito do Personagem"
                    placeholder="Ex: Um ex-monge que se tornou caçador após seu templo ser destruído..."
                    rows={6}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Atributos Principais" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Afiliação"
                           options={CHARACTER_AFFILIATIONS}
                           value={filters.affiliation?.value as string}
                           onChange={(val) => updateFilter('affiliation', CHARACTER_AFFILIATIONS.find(o => o.value === val) || null)}
                        />
                        {getRankOptions().length > 0 && (
                            <Select
                                label="Classe / Nível"
                                options={getRankOptions()}
                                value={filters.rank?.value as string}
                                onChange={(val) => updateFilter('rank', getRankOptions().find(o => o.value === val) || null)}
                            />
                        )}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Detalhes Adicionais">
                    <div className="space-y-4">
                       <SearchableMultiSelect 
                            label="Traços de Personalidade"
                            options={PERSONALITY_TRAITS}
                            selected={filters.personalityTraits.map(p => p.value as string)}
                            onChange={(vals) => updateFilter('personalityTraits', vals.map(v => PERSONALITY_TRAITS.find(o => o.value === v)).filter(Boolean) as SelectOption[])}
                            placeholder="Selecione traços..."
                       />
                       <Switch 
                            label="Gerar Habilidade Única"
                            checked={filters.generateUniqueAbility}
                            // FIX: pass boolean value from event
                            onChange={(e) => updateFilter('generateUniqueAbility', e.target.checked)}
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
                    {isLoading ? 'Criando...' : 'Gerar Personagem'}
                </Button>
            </div>
        </aside>
    );
};