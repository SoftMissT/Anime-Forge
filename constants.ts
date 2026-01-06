// constants.ts

import { BREATHING_STYLES_DATA } from './lib/breathingStylesData';
import { DETAILED_WEAPON_DATA } from './lib/detailedWeaponData';
import { GRIP_TYPES, WEAPON_TYPES } from './lib/weaponData';
import { HUNTER_ARCHETYPES_DATA } from './lib/hunterArchetypesData';
import { KEKKIJUTSU_INSPIRATIONS_DATA } from './lib/kekkijutsuInspirationsData';
import { ONI_ORIGINS_DATA } from './lib/oniOriginsData';
import { ORIGINS_DATA } from './lib/originsData';
import { SPECIAL_ABILITIES_DATA } from './lib/specialAbilitiesData';
import { PROFESSIONS_BY_TEMATICA } from './lib/professionsData';
import { TEMATICAS_DATA } from './lib/tematicasData';
import { PAISES_DATA } from './lib/paisesData';
import { MISSION_TYPES_DATA } from './lib/missionTypesData';
import { TERRAIN_TYPES_DATA } from './lib/terrainTypesData';
import { EVENT_TYPES_DATA } from './lib/eventTypesData';
import type { Category, Rarity } from './types';
import { HUNTER_CLASSES_DATA } from './lib/hunterClassesData';
import { FIGHTING_STYLES_DATA } from './lib/fightingStylesData';
import { ONI_CLASSES_DATA } from './lib/oniClassesData';
import { BLADE_COLOR_DATA } from './lib/bladeColorData';
import { TONALIDADE_DATA } from './lib/tonalidadeData';
import { CLAN_DATA } from './lib/clanData';
import { STRATEGY_DATA } from './lib/strategyData';
import { HUNTER_ARSENAL_DATA } from './lib/hunterArsenalData';
import { ERAS_DATA } from './lib/erasData';
import { METALS_DATA } from './lib/metalsData';

export const CATEGORIES: { value: Category, label: string }[] = [
    { value: 'Arma', label: '⚔️ Arma' },
    { value: 'Acessório', label: '💍 Acessório' },
    { value: 'Caçador', label: '👤 Caçador' },
    { value: 'Inimigo/Oni', label: '👹 Inimigo/Oni' },
    { value: 'Kekkijutsu', label: '🩸 Kekkijutsu' },
    { value: 'Respiração', label: '🌬️ Respiração' },
    { value: 'Missões', label: '📜 Missões' },
    { value: 'NPC', label: '👨‍🌾 NPC' },
    { value: 'Evento', label: '🗓️ Evento' },
    { value: 'Local/Cenário', label: '🗺️ Local/Cenário' },
    { value: 'Mitologia', label: '✨ Mitologia' },
    { value: 'História Antiga', label: '🏺 História Antiga' },
    { value: 'Guerra de Clãs', label: '⚔️ Guerra de Clãs' },
];

export const RARITIES: (Rarity | 'Aleatória')[] = ['Aleatória', 'Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'];

export const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

export const WEAPON_OPTIONS = HUNTER_ARSENAL_DATA.map(w => ({ value: w.nome, label: w.nome }));
export const GRIP_OPTIONS = GRIP_TYPES.map(g => ({ value: g.name, label: g.name }));
export const BREATHING_STYLE_OPTIONS = BREATHING_STYLES_DATA.map(b => ({ value: b.nome, label: b.nome }));
export const KEKKIJUTSU_INSPIRATION_OPTIONS = KEKKIJUTSU_INSPIRATIONS_DATA.map(k => ({ value: k.value, label: k.label }));
export const ONI_ORIGIN_OPTIONS = ONI_ORIGINS_DATA.map(o => ({ value: o.nome, label: o.nome }));
export const HUNTER_ARCHETYPE_OPTIONS = HUNTER_ARCHETYPES_DATA.flatMap(a => a.subclasses.map(s => ({ value: s.nome, label: s.nome })));
export const HUNTER_ORIGIN_OPTIONS = ORIGINS_DATA.map(o => ({ value: o.nome, label: o.nome }));
export const SPECIAL_ABILITY_OPTIONS = SPECIAL_ABILITIES_DATA.map(s => ({ value: s.name, label: s.name }));
export const MISSION_TYPE_OPTIONS = MISSION_TYPES_DATA.map(m => ({ value: m.value, label: m.label }));
export const TERRAIN_TYPE_OPTIONS = TERRAIN_TYPES_DATA.map(t => ({ value: t.value, label: t.label }));
export const EVENT_TYPE_OPTIONS = EVENT_TYPES_DATA.map(e => ({ value: e.value, label: e.label }));

// Options for Clan Wars
export const CLAN_OPTIONS = CLAN_DATA.map(c => ({ value: c.name, label: c.name }));
export const STRATEGY_OPTIONS = STRATEGY_DATA.map(s => ({ value: s.name, label: s.name }));
export const TURN_TYPE_OPTIONS = [
    { value: 'Turno por Turno', label: 'Turno por Turno' },
    { value: 'Tempo Real', label: 'Tempo Real' },
];


export const HUNTER_CLASS_OPTIONS = HUNTER_CLASSES_DATA.map(c => ({ value: c.name, label: c.name }));
export const FIGHTING_STYLE_OPTIONS = FIGHTING_STYLES_DATA.map(f => ({ value: f.name, label: f.name }));
export const ONI_CLASS_OPTIONS = ONI_CLASSES_DATA.map(o => ({ value: o.name, label: o.name }));
export const BLADE_COLOR_OPTIONS = BLADE_COLOR_DATA.map(c => ({ value: c.nome, label: c.nome }));
export const METAL_OPTIONS = METALS_DATA.map(m => ({ value: m.value, label: m.label }));
export const TONALIDADE_OPTIONS = TONALIDADE_DATA.filter(t => t.nome !== 'Aleatória').map(t => ({ value: t.nome, label: t.nome }));

export { PROFESSIONS_BY_TEMATICA, TEMATICAS_DATA, PAISES_DATA, ERAS_DATA };