// components/ClanWarsPanel.tsx
import React from 'react';
import { CLAN_OPTIONS, STRATEGY_OPTIONS, TERRAIN_TYPE_OPTIONS, TURN_TYPE_OPTIONS } from '../constants';
import type { FilterState } from '../types';
import { Button, CollapsibleSection, SearchableSelect, Slider, Spinner, TextArea } from './ui';
import { SwordsIcon } from './icons';

interface ClanWarsPanelProps {
  filters: Omit<FilterState, 'category' | 'rarity' | 'level' | 'quantity' | 'thematics' | 'tonalidade' | 'country'>;
  onFilterChange: (field: keyof ClanWarsPanelProps['filters'], value: any) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ClanWarsPanel: React.FC<ClanWarsPanelProps> = ({
  filters,
  onFilterChange,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <SwordsIcon className="w-6 h-6" />
        <h2 className="text-xl font-bold font-gangofthree">Configurar Batalha</h2>
      </div>

      <div className="filter-panel-body">
        <CollapsibleSection title="Seleção de Clãs" defaultOpen forceOpen>
          <div className="space-y-4">
            <SearchableSelect 
              label="Clã Atacante" 
              options={CLAN_OPTIONS} 
              value={filters.attackingClan || ''} 
              onChange={(v) => onFilterChange('attackingClan', v)} 
              placeholder="Selecione o clã atacante..."
            />
            <SearchableSelect 
              label="Clã Defensor" 
              options={CLAN_OPTIONS} 
              value={filters.defendingClan || ''} 
              onChange={(v) => onFilterChange('defendingClan', v)} 
              placeholder="Selecione o clã defensor..."
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Condições da Batalha" defaultOpen>
            <div className="space-y-4">
              <Slider 
                label="Tamanho do Exército (por clã)" 
                value={filters.armySize || 50} 
                onChange={(e) => onFilterChange('armySize', parseInt(e.target.value, 10))} 
                min={10} max={1000} step={10} 
              />
              <SearchableSelect 
                label="Terreno da Batalha" 
                options={TERRAIN_TYPE_OPTIONS} 
                value={filters.battleTerrain || 'Floresta Densa'} 
                onChange={(v) => onFilterChange('battleTerrain', v)} 
              />
              <SearchableSelect 
                label="Estratégia (Atacante)" 
                options={STRATEGY_OPTIONS} 
                value={filters.battleStrategy || 'Ataque Frontal'} 
                onChange={(v) => onFilterChange('battleStrategy', v)} 
              />
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Opções de Combate" defaultOpen>
            <div className="space-y-4">
                <SearchableSelect 
                    label="Tipo de Turno" 
                    options={TURN_TYPE_OPTIONS} 
                    value={filters.turnType || 'Turno por Turno'}
                    onChange={(v) => onFilterChange('turnType', v as any)} 
                />
                <Slider 
                    label="Velocidade da Simulação" 
                    value={filters.simulationSpeed || 1} 
                    onChange={(e) => onFilterChange('simulationSpeed', parseInt(e.target.value, 10))} 
                    min={1} max={5} step={1} 
                    tooltip="Define o ritmo da narrativa da batalha. 5x é mais rápido e caótico."
                />
            </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Cenário da Batalha (Opcional)">
          <TextArea
            className="prompt-modifier"
            placeholder="Ex: 'A batalha acontece durante um eclipse raro...', 'Um dos clãs está defendendo uma relíquia sagrada...', 'Um traidor muda o curso da guerra...'"
            value={filters.clanWarsScenario || ''}
            onChange={(e) => onFilterChange('clanWarsScenario', e.target.value)}
            rows={4}
            maxLength={1000}
          />
        </CollapsibleSection>
      </div>
      
      <div className="filter-panel-footer">
          <Button onClick={onGenerate} disabled={isLoading} className="btn-clan_wars w-full" size="lg">
            {isLoading ? (
                <>
                    <Spinner size="sm" />
                    Simulando...
                </>
            ) : (
                <>
                    <SwordsIcon className="w-6 h-6" />
                    Gerar Batalha
                </>
            )}
          </Button>
      </div>
    </div>
  );
};