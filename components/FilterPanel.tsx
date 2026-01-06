// components/FilterPanel.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
// FIX: Import Variants type from framer-motion to strongly type animation variants.
import { motion, type Variants } from 'framer-motion';
import {
  CATEGORIES, RARITIES, WEAPON_OPTIONS,
  KEKKIJUTSU_INSPIRATION_OPTIONS, HUNTER_ORIGIN_OPTIONS, SPECIAL_ABILITY_OPTIONS,
  MISSION_TYPE_OPTIONS, TERRAIN_TYPE_OPTIONS, EVENT_TYPE_OPTIONS,
  PROFESSIONS_BY_TEMATICA, TEMATICAS_DATA, PAISES_DATA, HUNTER_CLASS_OPTIONS,
  FIGHTING_STYLE_OPTIONS, ONI_ORIGIN_OPTIONS, ONI_CLASS_OPTIONS, BLADE_COLOR_OPTIONS,
  TONALIDADE_OPTIONS, CLAN_OPTIONS, STRATEGY_OPTIONS, METAL_OPTIONS, ERAS_DATA,
  BREATHING_STYLE_OPTIONS
} from '../constants';
import type { FilterState, Tematica, Category } from '../types';
import { Button, CollapsibleSection, NumberInput, SearchableMultiSelect, SearchableSelect, Slider, Spinner, TextArea } from './ui';
import { AnvilIcon, FilterIcon, RefreshIcon } from './icons';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(field: K, value: FilterState[K]) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  allowedCategories?: Category[];
}

// FIX: Explicitly typed variants with the Variants type to resolve type inference issues.
const filterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// FIX: Explicitly typed variants with the Variants type to resolve type inference issues.
const filterItemVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
};


export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onGenerate,
  onReset,
  isLoading,
  allowedCategories,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), 400);
    return () => clearTimeout(timer);
  }, [filters.category, filters.thematics]);

  // FIX: Safely get professions. If no thematics are selected, or the selected one doesn't exist, default to 'all'.
  const professionSourceKey = filters.thematics?.[0] || 'all';
  const professionSource = (PROFESSIONS_BY_TEMATICA as any)[professionSourceKey] || (PROFESSIONS_BY_TEMATICA as any)['all'];
  const professionOptions = (professionSource || []).map((p: string) => ({ value: p, label: p }));
  const eraOptions = (ERAS_DATA as any)[filters.country] || [];

  const categoryOptions = useMemo(() => {
    if (!allowedCategories) return CATEGORIES;
    const allowedSet = new Set(allowedCategories);
    return CATEGORIES.filter(cat => allowedSet.has(cat.value));
  }, [allowedCategories]);

  const renderCategorySpecificFilters = () => {
    switch (filters.category) {
      case 'Arma':
      case 'Acessório':
        return (
          <>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Tipo de Arma" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...WEAPON_OPTIONS]} value={filters.weaponType || 'Aleatória'} onChange={(v) => onFilterChange('weaponType', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Metal" options={METAL_OPTIONS} value={filters.metal || 'Aleatório'} onChange={(v) => onFilterChange('metal', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Cor da Lâmina" options={BLADE_COLOR_OPTIONS} value={filters.bladeColor || 'Aleatória'} onChange={(v) => onFilterChange('bladeColor', v)} />
            </motion.div>
          </>
        );
      case 'Caçador':
      case 'NPC':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe de Caçador" options={HUNTER_CLASS_OPTIONS} value={filters.hunterClass || 'Aleatória'} onChange={(v) => onFilterChange('hunterClass', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem" options={HUNTER_ORIGIN_OPTIONS} value={filters.hunterOrigin || 'Aleatório'} onChange={(v) => onFilterChange('hunterOrigin', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Respiração" options={BREATHING_STYLE_OPTIONS} value={filters.breathingStyle || 'Aleatória'} onChange={(v) => onFilterChange('breathingStyle', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Habilidade Especial" options={SPECIAL_ABILITY_OPTIONS} value={filters.specialAbility || 'Aleatória'} onChange={(v) => onFilterChange('specialAbility', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Estilo de Luta" options={FIGHTING_STYLE_OPTIONS} value={filters.fightingStyle || 'Aleatória'} onChange={(v) => onFilterChange('fightingStyle', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Profissão" options={professionOptions} value={filters.profession || 'Aleatória'} onChange={(v) => onFilterChange('profession', v)} />
            </motion.div>
          </>
        );
      case 'Inimigo/Oni':
        return (
          <>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={filters.kekkijutsuInspiration || 'Aleatória'} onChange={(v) => onFilterChange('kekkijutsuInspiration', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Origem do Oni" options={ONI_ORIGIN_OPTIONS} value={filters.oniOrigin || 'Aleatório'} onChange={(v) => onFilterChange('oniOrigin', v)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Classe do Oni" options={ONI_CLASS_OPTIONS} value={filters.oniClass || 'Aleatória'} onChange={(v) => onFilterChange('oniClass', v)} />
            </motion.div>
          </>
        );
      case 'Respiração':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Estilo Base (Opcional)" options={BREATHING_STYLE_OPTIONS} value={filters.breathingStyle || 'Aleatória'} onChange={(v) => onFilterChange('breathingStyle', v)} /></motion.div>;
      case 'Kekkijutsu':
        return <motion.div variants={filterItemVariants}><SearchableSelect label="Inspiração de Kekkijutsu" options={[{ value: 'Aleatória', label: 'Aleatória' }, ...KEKKIJUTSU_INSPIRATION_OPTIONS]} value={filters.kekkijutsuInspiration || 'Aleatória'} onChange={(v) => onFilterChange('kekkijutsuInspiration', v)} /></motion.div>;
      case 'Missões':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Missão" options={MISSION_TYPE_OPTIONS} value={filters.missionType || 'Aleatório'} onChange={(v) => onFilterChange('missionType', v)} /></motion.div>;
      case 'Local/Cenário':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Terreno" options={TERRAIN_TYPE_OPTIONS} value={filters.terrainType || 'Aleatório'} onChange={(v) => onFilterChange('terrainType', v)} /></motion.div>;
      case 'Evento':
          return <motion.div variants={filterItemVariants}><SearchableSelect label="Tipo de Evento" options={EVENT_TYPE_OPTIONS} value={filters.eventType || 'Aleatório'} onChange={(v) => onFilterChange('eventType', v)} /></motion.div>;
      default:
        return null;
    }
  };

  const categorySpecificFilters = renderCategorySpecificFilters();
  const showLevelSlider = ['Caçador', 'Inimigo/Oni', 'NPC'].includes(filters.category);
  
  const clanWarsFilters = filters.category === 'Guerra de Clãs' ? (
    <CollapsibleSection title="Filtros de Guerra de Clãs" defaultOpen>
        <div className="space-y-4">
            <SearchableSelect 
              label="Clã Atacante" 
              options={CLAN_OPTIONS} 
              value={filters.attackingClan || 'Esquadrão de Caçadores de Demônios'} 
              onChange={(v) => onFilterChange('attackingClan', v)} 
            />
            <SearchableSelect 
              label="Clã Defensor" 
              options={CLAN_OPTIONS} 
              value={filters.defendingClan || 'Os Doze Kizuki (Luas Demoníacas)'} 
              onChange={(v) => onFilterChange('defendingClan', v)} 
            />
            <Slider 
              label="Tamanho do Exército (por clã)" 
              value={filters.armySize || 100} 
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
  ) : null;

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <FilterIcon className="w-6 h-6" />
        <h2 className="text-xl font-bold font-gangofthree">Configurar Forja</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto !p-2">
            <RefreshIcon className="w-5 h-5"/>
        </Button>
      </div>

      <div className="filter-panel-body">
        <CollapsibleSection title="Filtros Principais" defaultOpen forceOpen>
          <motion.div className="space-y-4" variants={filterContainerVariants} initial="hidden" animate="visible">
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Categoria" options={categoryOptions} value={filters.category} onChange={(v) => onFilterChange('category', v as any)} />
            </motion.div>
            <motion.div variants={filterItemVariants}>
              <SearchableSelect label="Raridade" options={RARITIES.map(r => ({ value: r, label: r }))} value={filters.rarity} onChange={(v) => onFilterChange('rarity', v as any)} />
            </motion.div>
            {showLevelSlider && (
              <motion.div variants={filterItemVariants}>
                <Slider label="Nível Sugerido" value={filters.level} onChange={(e) => onFilterChange('level', parseInt(e.target.value, 10))} min={1} max={20} step={1} />
              </motion.div>
            )}
          </motion.div>
        </CollapsibleSection>

        {clanWarsFilters}

        {categorySpecificFilters && (
            <CollapsibleSection title="Filtros Específicos" defaultOpen>
                <motion.div 
                  className="space-y-4"
                  variants={filterContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {categorySpecificFilters}
                </motion.div>
            </CollapsibleSection>
        )}

        <CollapsibleSection title="Filtros de Tema" defaultOpen>
            <motion.div className="space-y-4" variants={filterContainerVariants} initial="hidden" animate="visible">
              <motion.div variants={filterItemVariants}>
                <SearchableMultiSelect label="Temática" options={TEMATICAS_DATA} selected={filters.thematics} onChange={(v) => onFilterChange('thematics', v as Tematica[])} placeholder="Selecione temáticas..." />
              </motion.div>
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Inspiração Cultural (País)" options={PAISES_DATA} value={filters.country} onChange={(v) => onFilterChange('country', v)} />
              </motion.div>
              {eraOptions.length > 0 && (
                 <motion.div variants={filterItemVariants}>
                  <SearchableSelect label="Era Histórica" options={eraOptions} value={filters.era || 'Aleatório'} onChange={(v) => onFilterChange('era', v)} />
                 </motion.div>
              )}
              <motion.div variants={filterItemVariants}>
                <SearchableSelect label="Tonalidade" options={TONALIDADE_OPTIONS} value={filters.tonalidade} onChange={(v) => onFilterChange('tonalidade', v)} />
              </motion.div>
            </motion.div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Modificador de Prompt">
          <motion.div variants={filterItemVariants} initial="hidden" animate="visible">
            <TextArea
              className="prompt-modifier"
              placeholder="Ex: 'um item que era de um pilar', 'um oni que usa gelo', etc."
              value={filters.promptModifier}
              onChange={(e) => onFilterChange('promptModifier', e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </motion.div>
        </CollapsibleSection>
      </div>
      
      <div className="filter-panel-footer">
          <NumberInput label="Quantidade a Gerar" value={filters.quantity} onChange={(v) => onFilterChange('quantity', v)} min={1} max={5} />
          <Button onClick={onGenerate} disabled={isLoading} className={`forge-button w-full ${isShaking ? 'animate-shake' : ''}`} size="lg">
            {isLoading ? (
                <>
                    <Spinner size="sm" />
                    Forjando...
                </>
            ) : (
                <>
                    <AnvilIcon className="w-6 h-6" />
                    Forjar Lenda
                </>
            )}
          </Button>
      </div>
    </div>
  );
};
