import {
    AnvilIcon,
    SwordsIcon as ConflictsIcon,
    UsersIcon as CharactersIcon,
    WindIcon as TechniquesIcon,
    MapIcon as LocationsIcon,
    BrainIcon as MasterToolsIcon,
    CauldronIcon as AlchemistIcon,
    ImageIcon as CosmakerIcon,
    VideoIcon as FilmmakerIcon,
    MusicIcon
} from './components/icons'; 
import type { Category, Rarity, FilterState, ViewItem, SelectOption, Tematica } from './types';
import { BREATHING_STYLES_DATA } from '../lib/breathingStylesData';
import { KEKKIJUTSU_INSPIRATIONS_DATA } from '../lib/kekkijutsuInspirationsData';
import { ONI_ORIGINS_DATA } from '../lib/oniOriginsData';
import { ORIGINS_DATA } from '../lib/originsData';
import { SPECIAL_ABILITIES_DATA } from '../lib/specialAbilitiesData';
import { PROFESSIONS_BY_TEMATICA } from '../lib/professionsData';
import { TEMATICAS_DATA } from '../lib/tematicasData';
import { PAISES_DATA } from '../lib/paisesData';
import { MISSION_TYPES_DATA } from '../lib/missionTypesData';
import { TERRAIN_TYPES_DATA } from '../lib/terrainTypesData';
import { EVENT_TYPES_DATA } from '../lib/eventTypesData';
import { HUNTER_CLASSES_DATA } from '../lib/hunterClassesData';
import { FIGHTING_STYLES_DATA } from '../lib/fightingStylesData';
import { ONI_CLASSES_DATA } from '../lib/oniClassesData';
import { BLADE_COLOR_DATA } from '../lib/bladeColorData';
import { TONALIDADE_DATA } from '../lib/tonalidadeData';
import { CLAN_DATA } from '../lib/clanData';
import { STRATEGY_DATA } from '../lib/strategyData';
import { HUNTER_ARSENAL_DATA } from '../lib/hunterArsenalData';
import { ERAS_DATA } from '../lib/erasData';
import { METALS_DATA } from '../lib/metalsData';
import { HUNTER_ARCHETYPES_DATA } from '../lib/hunterArchetypesData';
import { GRIP_TYPES } from '../lib/weaponData';

// --- CORE EXPORTS ---

export const VIEWS: ViewItem[] = [
    { id: 'forge', label: 'Forja', icon: AnvilIcon },
    { id: 'conflicts', label: 'Conflitos', icon: ConflictsIcon },
    { id: 'characters', label: 'Personagens', icon: CharactersIcon },
    { id: 'techniques', label: 'Técnicas', icon: TechniquesIcon },
    { id: 'locations', label: 'Locais', icon: LocationsIcon },
    { id: 'master_tools', label: 'Mestre', icon: MasterToolsIcon },
    { id: 'alchemist', label: 'Alquimista', icon: AlchemistIcon },
    { id: 'cosmaker', label: 'Visualizador', icon: CosmakerIcon },
    { id: 'filmmaker', label: 'Roteirista', icon: FilmmakerIcon },
    { id: 'bard', label: 'Bardo', icon: MusicIcon },
];

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
    { value: 'Música/Poesia', label: '🎵 Música/Poesia' },
    { value: 'Prompt Visual', label: '🎨 Prompt Visual' },
    { value: 'Roteiro', label: '🎬 Roteiro' },
];

export const FORGE_CATEGORIES = CATEGORIES;

export const RARITIES: (Rarity | 'Aleatória')[] = ['Aleatória', 'Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'];

export const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

export const INITIAL_FILTER_STATE: FilterState = {
  category: 'Arma',
  rarity: 'Aleatória',
  level: 1,
  quantity: 1,
  promptModifier: '',
  thematics: [],
  country: 'Japão',
  era: 'Aleatório',
  tonalidade: 'Sombria',
};

// --- FILTER OPTIONS ---

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

// --- VIEW SPECIFIC CONSTANTS ---

export const CONFLICT_SCALES: SelectOption[] = [
    { value: 0, label: 'Duelo Pessoal' },
    { value: 25, label: 'Escaramuça Local' },
    { value: 50, label: 'Batalha Regional' },
    { value: 75, label: 'Guerra de Grande Escala' },
    { value: 100, label: 'Conflito Apocalíptico' },
];
export const CONFLICT_TYPES: SelectOption[] = [{ value: 'defesa', label: 'Defesa' }, { value: 'investigacao', label: 'Investigação' }];
export const FACTIONS: SelectOption[] = [{ value: 'cazadores', label: 'Caçadores de Onis' }, { value: 'onis', label: 'Onis' }];

export const CHARACTER_AFFILIATIONS: SelectOption[] = [{ value: 'demon_slayer', label: 'Caçador de Oni' }, { value: 'demon', label: 'Oni' }];
export const DEMON_SLAYER_RANKS: SelectOption[] = [{ value: 'mizunoto', label: 'Mizunoto' }, { value: 'hashira', label: 'Hashira' }];
export const DEMON_RANKS: SelectOption[] = [{ value: 'inferior', label: 'Lua Inferior' }, { value: 'superior', label: 'Lua Superior' }];
export const PERSONALITY_TRAITS: SelectOption[] = [{ value: 'corajoso', label: 'Corajoso' }, { value: 'calmo', label: 'Calmo' }];

export const TECHNIQUE_TYPES: SelectOption[] = [{ value: 'respiracao', label: 'Respiração' }, { value: 'kekkijutsu', label: 'Kekkijutsu' }];
export const BASE_ELEMENTS: SelectOption[] = [{ value: 'agua', label: 'Água' }, { value: 'fogo', label: 'Fogo' }];
export const TECHNIQUE_COMPLEXITY: SelectOption[] = [{ value: 'simples', label: 'Simples' }, { value: 'medio', label: 'Médio' }, { value: 'complexo', label: 'Complexo' }];

export const LOCATION_BIOMES: SelectOption[] = [{ value: 'floresta', label: 'Floresta' }, { value: 'montanha', label: 'Montanha' }];
export const LOCATION_ATMOSPHERES: SelectOption[] = [{ value: 'misteriosa', label: 'Misteriosa' }, { value: 'pacifica', label: 'Pacífica' }];

export const MASTER_TOOL_TYPES: SelectOption[] = [
    { value: 'name_generator', label: 'Gerador de Nomes' },
    { value: 'plot_hook_generator', label: 'Gerador de Ganchos de Trama' },
    { value: 'onomatopoeia_generator', label: 'Gerador de Onomatopeias' },
];
export const NAME_CATEGORIES: SelectOption[] = [
    { value: 'personagem', label: 'Personagem' },
    { value: 'local', label: 'Local' },
    { value: 'tecnica', label: 'Técnica' },
];
export const PLOT_HOOK_GENRES: SelectOption[] = [{ value: 'misterio', label: 'Mistério' }, { value: 'acao', label: 'Ação' }];
export const ONOMATOPOEIA_TYPES: SelectOption[] = [{ value: 'combate', label: 'Combate' }, { value: 'natureza', label: 'Natureza' }];

export const AI_MODELS: SelectOption[] = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

export const COSMAKER_CHARACTER_TYPES: SelectOption[] = [{ value: 'cacador', label: 'Caçador' }, { value: 'oni', label: 'Oni' }];
export const COSMAKER_ART_STYLES: SelectOption[] = [
    { value: 'anime_classic', label: 'Anime Clássico (Anos 90)' }, 
    { value: 'ufotable_style', label: 'Estilo Ufotable (Moderno/Efeitos)' },
    { value: 'ukiyo_e', label: 'Ukiyo-e (Gravura Tradicional)' },
    { value: 'dark_fantasy', label: 'Fantasia Sombria Realista' },
    { value: 'concept_art', label: 'Concept Art Detalhado' }
];
export const COSMAKER_COLORS: SelectOption[] = [{ value: 'vermelho', label: 'Vermelho' }, { value: 'azul', label: 'Azul' }];
export const COSMAKER_MATERIALS: SelectOption[] = [{ value: 'seda', label: 'Seda' }, { value: 'couro', label: 'Couro' }];

export const VIDEO_ASPECT_RATIOS: SelectOption[] = [{ value: '16:9', label: '16:9 (Widescreen)' }, { value: '9:16', label: '9:16 (Vertical)' }];
export const VIDEO_RESOLUTIONS: SelectOption[] = [{ value: '720p', label: '720p (HD)' }, { value: '1080p', label: '1080p (Full HD)' }];

export const MUSICAL_STYLES: SelectOption[] = [
    { value: 'shamisen_rock', label: 'Shamisen Rock (Estilo OP)' },
    { value: 'flauta_melancolica', label: 'Flauta Melancólica' },
    { value: 'canto_batalha', label: 'Canto de Batalha' },
    { value: 'haiku_recitado', label: 'Haiku Recitado' },
    { value: 'folclore_japones', label: 'Folclore Japonês' }
];

export const DETAIL_LEVELS: SelectOption[] = [{ value: 'baixo', label: 'Baixo' }, { value: 'medio', label: 'Médio' }, { value: 'alto', label: 'Alto' }];
export const CREATIVE_STYLES: SelectOption[] = [{ value: 'sombrio', label: 'Sombrio' }, { value: 'heroico', label: 'Heróico' }];

export { PROFESSIONS_BY_TEMATICA, TEMATICAS_DATA, PAISES_DATA, ERAS_DATA };