import React from 'react';

// types.ts

// Core types for different generation categories
export type Category = 'Arma' | 'Acessório' | 'Caçador' | 'Inimigo/Oni' | 'Kekkijutsu' | 'Respiração' | 'Missões' | 'NPC' | 'Evento' | 'Local/Cenário' | 'Mitologia' | 'História Antiga' | 'Guerra de Clãs' | 'Música/Poesia' | 'Prompt Visual' | 'Roteiro';

export type Rarity = 'Comum' | 'Incomum' | 'Rara' | 'Épica' | 'Lendária';
export type Tematica = 'Aleatória' | 'Período Edo (Japão Feudal)' | 'Medieval Fantasia' | 'Steampunk' | 'Cyberpunk' | 'Pós-apocalíptico' | 'Moderno' | 'Tempos Atuais' | 'Futurista (Sci-Fi)' | 'Biopunk' | 'Shogunato Cibernético' | 'Faroeste Sombrio' | 'Noir Gótico' | 'Piratas das Profundezas' | 'Samurai Fantasma' | 'Cripto-Punk' | 'Viagem no Tempo (Era Meiji)' | 'A Era dos Caçadores' | 'O Caminho do Guerreiro' | 'O Ritual da Lua Negra' | 'DOS CAÇADORES DE SOMBRAS' | '⚔️ DOS DEUSES CAÍDOS' | '🕵️‍♂️ DO JAZZ & OCULTISMO' | '⚗️ DA REVOLUÇÃO INDUSTRIAL OCULTA' | '🤠 VELHO OESTE SOLAR' | '🏴‍☠️ DOS IMPÉRIOS FLUTUANTES' | '🏜️ DO SAARA ETERNO' | '🎭 DOS CINCO REINOS (WUXIA/XIANXIA)' | '🧙 DA ALVORADA ANCESTRAL' | '🧬 DO JARDIM PROIBIDO (BIOPUNK ORGÂNICO)' | 'Neon-Noir Megacidade' | '💠 DA INFOCRACIA' | '🌃 DO RENASCIMENTO SOMBRIO' | '🌃 DO SUBMUNDO NOTURNO' | 'Mythpunk Amazônico' | 'Ártico Steampunk' | '🌌 DOS CINZÁRIOS (PÓS-APOCALÍPTico MÍSTICO)' | '🧟 DA QUEDA DOS REINOS' | '🤖 DA SINGULARIDADE (PÓS-HUMANA)';

// Forge Generation Types
export interface ProvenanceEntry {
  step: string;
  model: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  reason?: string;
}

export interface ValidationMetadata {
  score: number;
  warnings: string[];
  attempts: number;
  timestamp: string;
}

interface BaseGeneratedItem {
  id: string;
  createdAt: string;
  categoria: Category;
  nome: string;
  title?: string;
  descricao_curta: string;
  descricao: string;
  content?: string; 
  raridade: Rarity;
  nivel_sugerido: number;
  ganchos_narrativos: string[] | string;
  imagePromptDescription?: string; // Mantido como texto do prompt
  videoPromptDescription?: string; // Mantido como texto do prompt
  provenance?: ProvenanceEntry[];
  _validation?: ValidationMetadata;
  is_favorite?: boolean;
  // Campos de mídia direta (blob/url) removidos ou mantidos como null para compatibilidade legada se necessário
  imageUrl?: string | null; 
  userId?: string;
}

export interface WeaponItem extends BaseGeneratedItem {
  dano: string;
  dados: string;
  tipo_de_dano: string;
  preco_sugerido: number;
  status_aplicado?: string;
  efeitos_secundarios?: string;
}

export interface HunterWeapon {
  nome: string;
  dano: string;
  tipo_de_dano: string;
  propriedade: string;
}

export interface HunterItem extends BaseGeneratedItem {
  classe: string;
  personalidade: string;
  background: string;
  respiracao?: string;
  habilidade_especial: string;
  estilo_de_luta: string;
  equipamento: HunterWeapon[];
}

export interface KekkijutsuDetails {
  nome: string;
  descricao: string;
  tipo: string; 
  custo_pc: number;
}

export interface OniItem extends BaseGeneratedItem {
  power_level: string;
  kekkijutsu: KekkijutsuDetails;
  comportamento_combate: string[];
}

export type GeneratedItem = BaseGeneratedItem | WeaponItem | HunterItem | OniItem;
export type ForgeItem = GeneratedItem;

// Forge Filter State
export interface FilterState {
  category: Category;
  rarity: Rarity | 'Aleatória';
  level: number;
  promptModifier: string;
  quantity: number;
  thematics: Tematica[];
  tonalidade: string;
  country: string;
  era?: string;
  metal?: string;
  // Category-specific filters
  weaponType?: string;
  gripType?: string;
  bladeColor?: string;
  breathingStyle?: string;
  kekkijutsuInspiration?: string;
  hunterOrigin?: string;
  specialAbility?: string;
  hunterClass?: string;
  hunterArchetype?: string;
  fightingStyle?: string;
  oniOrigin?: string;
  oniClass?: string;
  profession?: string;
  missionType?: string;
  terrainType?: string;
  eventType?: string;
  // Clan Wars filters
  attackingClan?: string;
  defendingClan?: string;
  armySize?: number;
  battleTerrain?: string;
  battleStrategy?: string;
  clanWarsScenario?: string;
  turnType?: 'Turno por Turno' | 'Tempo Real';
  simulationSpeed?: number;
  // Bard filters
  musicalStyle?: string;
  lyricsTheme?: string;
}

// User Authentication
export interface User {
  id: string;
  username: string;
  avatar: string;
}

// Clan Wars Types
export interface ClanWarsResult {
  id: string;
  createdAt: string;
  titulo: string;
  resumo_resultado: string;
  narrativa_batalha: string;
  fases_batalha: Array<{
    fase: 'Início da Batalha' | 'Meio da Batalha' | 'Fim da Batalha';
    descricao: string;
  }>;
  momentos_chave: string[];
  consequencias: {
    para_vencedor: string;
    para_perdedor: string;
    para_regiao: string;
  };
  provenance?: ProvenanceEntry[];
}

// Master Tools Types
export interface MasterToolResult {
    xp: number;
    justificativa: string;
    impacto_narrativo: string;
    recompensas_extras: string[];
}

export interface MasterToolHistoryItem {
    id: string;
    createdAt: string;
    userInput: string;
    aiOutput: MasterToolResult;
}

// History & Favorites
export type HistoryItem = GeneratedItem;
export type FavoriteItem = GeneratedItem;

// App Core UI types
export type AppView = 'forge' | 'characters' | 'techniques' | 'locations' | 'conflicts' | 'master_tools' | 'alchemist' | 'cosmaker' | 'filmmaker' | 'bard';
export type View = AppView;

export interface AppError {
  message: string;
  details?: string | string[];
  canRetry?: boolean;
  onRetry?: () => void;
  type?: 'error' | 'warning';
}

export interface LoadingState {
  active: boolean;
  content?: 'forge' | 'clan_wars' | 'master_tools' | 'generic' | 'alchemy' | 'image_edit' | 'video_generation' | 'bard';
  context?: any;
}

export interface ViewItem {
    id: AppView;
    label: string;
    icon: React.FC<{ className?: string }>;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

// ... existing interfaces ...
export interface ConflictItem {
    id: string;
    name: string;
    synopsis: string;
    scale: string;
    missionType: string;
    isFavorite: boolean;
}

export interface CharacterItem {
    id: string;
    name: string;
    affiliation: string;
    rank: string;
    backstory: string;
    appearance: string;
    personality: string;
    abilities: string;
    isFavorite: boolean;
}

export interface TechniqueItem {
    id: string;
    name: string;
    type: string;
    baseElement: string;
    description: string;
    isFavorite: boolean;
}

export interface LocationItem {
    id: string;
    name: string;
    biome: string;
    atmosphere: string;
    description: string;
    pointsOfInterest?: string;
    isFavorite: boolean;
}

export interface MasterToolItem {
    id: string;
    content: string;
    toolType: string;
    isFavorite: boolean;
}

export interface AlchemistItem {
    id: string;
    response: string;
    prompt: string;
    parameters: {
        model: string;
        temperature: number;
        topP: number;
        topK: number;
    };
    isFavorite: boolean;
}

export interface CosmakerItem {
    id: string;
    prompt: string;
    // Removido imageUrl real, agora foca no prompt gerado e descrição visual
    visualDescription: string;
    generatedPrompt: string; 
    isFavorite: boolean;
}

export interface FilmmakerItem {
    id: string;
    prompt: string;
    script: string;
    videoPrompt: string; // Prompt otimizado para Veo/Sora
    isFavorite: boolean;
}

export interface BardItem {
    id: string;
    title: string;
    lyrics: string;
    style: string;
    isFavorite: boolean;
}


// Prompt Engineering Types (Alchemy)
export interface MJParam<T> {
  active: boolean;
  value: T;
}
export interface MidjourneyParameters {
    aspectRatio: MJParam<string>;
    chaos: MJParam<number>;
    quality?: MJParam<number>;
    style: MJParam<string>;
    stylize: MJParam<number>;
    version: MJParam<string>;
    weird: MJParam<number>;
}

export interface GptParameters {
    tone: string;
    style: string;
    composition: string;
}

export interface GeminiParameters {
    artStyle: string;
    lighting: string;
    colorPalette: string;
    composition: string;
    detailLevel: string;
}

export interface PromptGenerationResult {
    midjourneyPrompt?: string;
    gptPrompt?: string;
    geminiPrompt?: string;
}

export interface AlchemyHistoryItem {
    id: string;
    createdAt: string;
    inputs: {
        basePrompt: string;
        negativePrompt: string;
        generateFor: {
            midjourney: boolean;
            gpt: boolean;
            gemini: boolean;
        };
    };
    outputs: PromptGenerationResult;
}

export interface VideoGenerationParams {
    prompt: string;
    config: {
        resolution: '720p' | '1080p';
        aspectRatio: '16:9' | '9:16';
    };
    user: User;
}

export interface VideoOperationStatus {
    done: boolean;
    videoUrl?: string; // Opcional, agora serve mais para metadados se necessário
    error?: string;
    operation: any; 
}

export interface GenerateImageRequest {
    prompt: string;
    user: User;
    // Removido sourceImage
}