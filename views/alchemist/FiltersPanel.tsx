import React from 'react';
import { Button } from '../../components/ui/Button';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { Select } from '../../components/ui/Select';
import { Slider } from '../../components/ui/Slider';
import { TextArea } from '../../components/ui/TextArea';
// FIX: Added AI_MODELS to constants export
import { AI_MODELS } from '../../constants';
import type { AlchemistState } from '../AlchemistInterface';
import { SelectOption } from '../../types';

interface FiltersPanelProps {
    filters: AlchemistState;
    setFilters: React.Dispatch<React.SetStateAction<AlchemistState>>;
    onGenerate: () => void;
    isLoading: boolean;
    onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters, onGenerate, isLoading, onClear }) => {
    
    const updateFilter = <K extends keyof AlchemistState>(key: K, value: AlchemistState[K]) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
            <div className="p-4 border-b border-border-color">
                <h2 className="text-lg font-semibold">Laboratório do Alquimista</h2>
                 <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Limpar Filtros</Button>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-6">
                <TextArea
                    label="Instrução de Sistema (Persona da IA)"
                    placeholder="Ex: Aja como um mestre ferreiro do período Taishō..."
                    rows={4}
                    value={filters.systemInstruction}
                    onChange={(e) => updateFilter('systemInstruction', e.target.value)}
                />
                
                <TextArea
                    label="Prompt Principal"
                    placeholder="Insira seu prompt detalhado aqui..."
                    rows={8}
                    value={filters.prompt}
                    onChange={(e) => updateFilter('prompt', e.target.value)}
                />

                <CollapsibleSection title="Parâmetros do Modelo" defaultOpen>
                    <div className="space-y-4">
                        <Select 
                           label="Modelo de IA"
                           options={AI_MODELS}
                           value={filters.model?.value as string}
                           onChange={(val) => updateFilter('model', AI_MODELS.find(o => o.value === val) || null)}
                        />
                         <Slider 
                            label="Temperatura (Criatividade)"
                            min={0}
                            max={1}
                            step={0.05}
                            value={filters.temperature}
                            onChange={(e) => updateFilter('temperature', parseFloat(e.target.value))}
                        />
                        <Slider 
                            label="Top-P"
                            min={0}
                            max={1}
                            step={0.05}
                            value={filters.topP}
                            onChange={(e) => updateFilter('topP', parseFloat(e.target.value))}
                        />
                         <Slider 
                            label="Top-K"
                            min={1}
                            max={100}
                            step={1}
                            value={filters.topK}
                            onChange={(e) => updateFilter('topK', parseInt(e.target.value, 10))}
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
                    {isLoading ? 'Transmutando...' : 'Gerar Resposta'}
                </Button>
            </div>
        </aside>
    );
};