

import type { Category, Rarity, FilterState, ViewItem, SelectOption } from './types';
import { 
    AnvilIcon, 
    ConflictsIcon, 
    CharactersIcon, 
    TechniquesIcon, 
    LocationsIcon, 
    MasterToolsIcon, 
    AlchemistIcon,
    CosmakerIcon,
    FilmmakerIcon
} from './components/icons';

const BREATHING_STYLES_DATA: { nome: string }[] = [
    { nome: 'Água' }, { nome: 'Chama' }, { nome: 'Vento' }, { nome: 'Pedra' }, { nome: 'Trovão' },
    { nome: 'Sol' }, { nome: 'Lua' }, { nome: 'Névoa' }, { nome: 'Serpente' }, { nome: 'Amor' },
    { nome: 'Inseto' }, { nome: 'Som' }, { nome: 'Besta' }, { nome: 'Flor' },
];

const HUNTER_ARSENAL_DATA: { nome: string }[] = [
    { nome: 'Katana Nichirin' }, { nome: 'Wakizashi Nichirin' }, { nome: 'Nodachi Nichirin' },
    { nome: 'Katanas Nichirin Duplas' }, { nome: 'Mangual Nichirin' }, { nome: 'Machado e Mangual com Espinhos' },
    { nome: 'Espingarda Nichirin' }, { nome: 'Lâmina Chicote Nichirin' },
];

const KEKKIJUTSU_INSPIRATIONS_DATA: { value: string, label: string }[] = [
    { value: 'biocinese', label: 'Biocinese (Manipulação Corporal)' },
    { value: 'elemental', label: 'Manipulação Elemental' },
    { value: 'espacial', label: 'Manipulação Espacial' },
    { value: 'ilusoes', label: 'Ilusões e Sonhos' },
    { value: 'aumento', label: 'Aumento de Poder Físico' },
    { value: 'invocacao', label: 'Invocação' },
];

const ONI_ORIGINS_DATA: { nome: string }[] = [
    { nome: 'Passado Trágico' }, { nome: 'Experimento Científico' },
    { nome: 'Linhagem Amaldiçoada' }, { nome: 'Transformação Voluntária' }, { nome: 'Vítima de Muzan' },
];

const ORIGINS_DATA: { nome: string }[] = [
    { nome: 'Kakushi' }, { nome: 'Vila dos Ferreiros' },
    { nome: 'Ex-Membro de Culto' }, { nome: 'Família Nobre' }, { nome: 'Estrangeiro' },
];

const SPECIAL_ABILITIES_DATA: { name: string }[] = [
    { name: 'Olfato Aprimorado' }, { name: 'Audição Aprimorada' }, { name: 'Tato Aprimorado' },
    { name: 'Respiração de Concentração Total: Constante' }, { name: 'Mundo Transparente' }, { name: 'Marca do Caçador' },
];

export const PROFESSIONS_BY_TEMATICA: { [key: string]: string[] } = {
    all: ['Fazendeiro', 'Comerciante', 'Artesão', 'Médico', 'Monge', 'Puxador de Riquixá', 'Gueixa'],
    Urbano: ['Comerciante', 'Puxador de Riquixá', 'Médico', 'Dono de Restaurante', 'Policial'],
    Rural: ['Fazendeiro', 'Lenhador', 'Caçador', 'Monge', 'Herborista'],
    Artistico: ['Pintor', 'Músico', 'Ator de Kabuki', 'Gueixa', 'Escritor'],
};

export const TEMATICAS_DATA: { value: string, label: string }[] = [
    { value: 'Vingança', label: 'Vingança' }, { value: 'Redenção', label: 'Redenção' },
    { value: 'Dever', label: 'Dever' }, { value: 'Sobrevivência', label: 'Sobrevivência' },
    { value: 'Tradição vs Modernidade', label: 'Tradição vs Modernidade' }, { value: 'Laços Familiares', label: 'Laços Familiares' },
];

const MISSION_TYPES_DATA: { value: string, label: string }[] = [
    { value: 'Investigação', label: 'Investigação' }, { value: 'Extermínio', label: 'Extermínio' },
    { value: 'Proteção', label: 'Proteção' }, { value: 'Reconhecimento', label: 'Reconhecimento' },
    { value: 'Resgate', label: 'Resgate' },
];

const TERRAIN_TYPES_DATA: { value: string, label: string }[] = [
    { value: 'Floresta Densa', label: 'Floresta Densa' }, { value: 'Montanha Nevada', label: 'Montanha Nevada' },
    { value: 'Cidade Agitada', label: 'Cidade Agitada' }, { value: 'Pântano', label: 'Pântano' },
    { value: 'Caverna Subterrânea', label: 'Caverna Subterrânea' }, { value: 'Fortaleza Infinita', label: 'Fortaleza Infinita' },
];

const EVENT_TYPES_DATA: { value: string, label: string }[] = [
    { value: 'Infestação Demoníaca', label: 'Infestação Demoníaca' }, { value: 'Reunião dos Hashiras', label: 'Reunião dos Hashiras' },
    { value: 'Ataque à Vila dos Ferreiros', label: 'Ataque à Vila dos Ferreiros' }, { value: 'Seleção Final', label: 'Seleção Final' },
];

const HUNTER_CLASSES_DATA: { name: string }[] = [
    { name: 'Mizunoto' }, { name: 'Mizunoe' }, { name: 'Kanoto' }, { name: 'Kanoe' },
    { name: 'Tsuchinoto' }, { name: 'Tsuchinoe' }, { name: 'Hinoto' }, { name: 'Hinoe' },
    { name: 'Kinoto' }, { name: 'Kinoe' }, { name: 'Hashira' },
];

const FIGHTING_STYLES_DATA: { name: string }[] = [
    { name: 'Rápido e Ágil' }, { name: 'Defesa Impenetrável' },
    { name: 'Enganoso e Imprevisível' }, { name: 'Força Bruta' }, { name: 'Combate à Distância' },
];

const ONI_CLASSES_DATA: { name: string }[] = [
    { name: 'Lua Inferior' }, { name: 'Lua Superior' },
    { name: 'Guarda Pessoal de Muzan' }, { name: 'Oni Renegado' }, { name: 'Oni Comum' },
];

const BLADE_COLOR_DATA: { nome: string }[] = [
    { nome: 'Preto' }, { nome: 'Azul' }, { nome: 'Vermelho' }, { nome: 'Amarelo' },
    { nome: 'Verde' }, { nome: 'Rosa' }, { nome: 'Branco' }, { nome: 'Cinza-Índigo' }, { nome: 'Lavanda' },
];

const TONALIDADE_DATA: { nome: string }[] = [
    { nome: 'Sombria' }, { nome: 'Heróica' }, { nome: 'Trágica' }, { nome: 'Cômica' }, { nome: 'Misteriosa' },
];

const CLAN_DATA: { name: string }[] = [
    { name: 'Clã Ubuyashiki' }, { name: 'Família Kamado' }, { name: 'Família Rengoku' },
    { name: 'Clã Uzui' }, { name: 'Família Shinazugawa' }, { name: 'Doze Kizuki' }, { name: 'Esquadrão de Caçadores de Demônios' },
];

const STRATEGY_DATA: { name: string }[] = [
    { name: 'Ataque Frontal' }, { name: 'Emboscada' }, { name: 'Táticas de Guerrilha' },
    { name: 'Movimento Pinça' }, { name: 'Guerra de Atrito' }, { name: 'Retirada Estratégica' },
];

export const PAISES_DATA: { value: string, label: string }[] = [
    { value: 'Japão', label: 'Japão' },
    { value: 'China', label: 'China' },
    { value: 'Coreia', label: 'Coreia' },
    { value: 'Aleatório', label: 'Aleatório' },
];

export const ERAS_DATA: { [key: string]: { value: string, label: string }[] } = {
    'Japão': [
        { value: 'Aleatório', label: 'Aleatório' },
        { value: 'Sengoku', label: 'Sengoku' },
        { value: 'Edo', label: 'Edo' },
        { value: 'Meiji', label: 'Meiji' },
        { value: 'Taishō', label: 'Taishō' },
    ]
};

const METALS_DATA: { value: string, label: string }[] = [
    { value: 'Areia de Ferro Carmesim Escarlate', label: 'Areia de Ferro Carmesim Escarlate' },
    { value: 'Minério Carmesim Escarlate', label: 'Minério Carmesim Escarlate' },
    { value: 'Hihiirokane', label: 'Hihi\'irokane' },
];

// FIX: Exported VIEWS constant.
export const VIEWS: ViewItem[] = [
    { id: 'forge', label: 'Forja', icon: AnvilIcon },
    { id: 'conflicts', label: 'Conflitos', icon: ConflictsIcon },
    { id: 'characters', label: 'Personagens', icon: CharactersIcon },
    { id: 'techniques', label: 'Técnicas', icon: TechniquesIcon },
    { id: 'locations', label: 'Locais', icon: LocationsIcon },
    { id: 'master_tools', label: 'Mestre', icon: MasterToolsIcon },
    { id: 'alchemist', label: 'Alquimista', icon: AlchemistIcon },
    { id: 'cosmaker', label: 'Cosmaker', icon: CosmakerIcon },
    { id: 'filmmaker', label: 'Cineasta', icon: FilmmakerIcon },
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
];

export const RARITIES: (Rarity | 'Aleatória')[] = ['Aleatória', 'Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'];

export const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1);

export const WEAPON_OPTIONS = HUNTER_ARSENAL_DATA.map(w => ({ value: w.nome, label: w.nome }));
export const BREATHING_STYLE_OPTIONS = BREATHING_STYLES_DATA.map(b => ({ value: b.nome, label: b.nome }));
export const KEKKIJUTSU_INSPIRATION_OPTIONS = KEKKIJUTSU_INSPIRATIONS_DATA.map(k => ({ value: k.value, label: k.label }));
export const ONI_ORIGIN_OPTIONS = ONI_ORIGINS_DATA.map(o => ({ value: o.nome, label: o.nome }));
export const HUNTER_ORIGIN_OPTIONS = ORIGINS_DATA.map(o => ({ value: o.nome, label: o.nome }));
export const SPECIAL_ABILITY_OPTIONS = SPECIAL_ABILITIES_DATA.map(s => ({ value: s.name, label: s.name }));
export const MISSION_TYPE_OPTIONS = MISSION_TYPES_DATA.map(m => ({ value: m.value, label: m.label }));
export const TERRAIN_TYPE_OPTIONS = TERRAIN_TYPES_DATA.map(t => ({ value: t.value, label: t.label }));
export const EVENT_TYPE_OPTIONS = EVENT_TYPES_DATA.map(e => ({ value: e.value, label: e.label }));

export const CLAN_OPTIONS = CLAN_DATA.map(c => ({ value: c.name, label: c.name }));
export const STRATEGY_OPTIONS = STRATEGY_DATA.map(s => ({ value: s.name, label: s.name }));

export const HUNTER_CLASS_OPTIONS = HUNTER_CLASSES_DATA.map(c => ({ value: c.name, label: c.name }));
export const FIGHTING_STYLE_OPTIONS = FIGHTING_STYLES_DATA.map(f => ({ value: f.name, label: f.name }));
export const ONI_CLASS_OPTIONS = ONI_CLASSES_DATA.map(o => ({ value: o.name, label: o.name }));
export const BLADE_COLOR_OPTIONS = BLADE_COLOR_DATA.map(c => ({ value: c.nome, label: c.nome }));
export const METAL_OPTIONS = METALS_DATA.map(m => ({ value: m.value, label: m.label }));
export const TONALIDADE_OPTIONS = TONALIDADE_DATA.map(t => ({ value: t.nome, label: t.nome }));

// FIX: Exported various constants for different views.
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

export const FORGE_CATEGORIES: SelectOption[] = CATEGORIES.map(c => ({ value: c.value, label: c.label }));
export const DETAIL_LEVELS: SelectOption[] = [{ value: 'baixo', label: 'Baixo' }, { value: 'medio', label: 'Médio' }, { value: 'alto', label: 'Alto' }];
export const CREATIVE_STYLES: SelectOption[] = [{ value: 'sombrio', label: 'Sombrio' }, { value: 'heroico', label: 'Heróico' }];

export const AI_MODELS: SelectOption[] = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

export const COSMAKER_CHARACTER_TYPES: SelectOption[] = [{ value: 'cacador', label: 'Caçador' }, { value: 'oni', label: 'Oni' }];
export const COSMAKER_ART_STYLES: SelectOption[] = [{ value: 'anime', label: 'Anime' }, { value: 'realista', label: 'Realista' }];
export const COSMAKER_COLORS: SelectOption[] = [{ value: 'vermelho', label: 'Vermelho' }, { value: 'azul', label: 'Azul' }];
export const COSMAKER_MATERIALS: SelectOption[] = [{ value: 'seda', label: 'Seda' }, { value: 'couro', label: 'Couro' }];

export const VIDEO_ASPECT_RATIOS: SelectOption[] = [{ value: '16:9', label: '16:9 (Widescreen)' }, { value: '9:16', label: '9:16 (Vertical)' }];
export const VIDEO_RESOLUTIONS: SelectOption[] = [{ value: '720p', label: '720p (HD)' }, { value: '1080p', label: '1080p (Full HD)' }];

// FIX: Exported INITIAL_FILTER_STATE.
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
