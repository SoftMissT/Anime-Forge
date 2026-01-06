
// lib/tabsData.ts
import React from 'react';
import { AnvilIcon, UsersIcon, WindIcon, MapIcon, SwordsIcon, BrainIcon, CauldronIcon, MusicIcon, ImageIcon, VideoIcon } from '../components/icons/index';
import type { AppView, Category } from '../types';

export interface TabConfig {
    id: AppView;
    name: string;
    icon: React.FC<{ className?: string }>;
    defaultCategory?: Category;
    allowedCategories?: Category[];
    themeColor: 'forge' | 'characters' | 'techniques' | 'locations' | 'conflicts' | 'master_tools' | 'alchemist' | 'bard' | 'cosmaker' | 'filmmaker';
}

export const TABS_DATA: TabConfig[] = [
    { id: 'conflicts', name: 'Conflitos', icon: SwordsIcon, themeColor: 'conflicts', defaultCategory: 'Guerra de Clãs' },
    { id: 'forge', name: 'Forja', icon: AnvilIcon, themeColor: 'forge', defaultCategory: 'Arma', allowedCategories: ['Arma', 'Acessório'] },
    { id: 'characters', name: 'Personagens', icon: UsersIcon, themeColor: 'characters', defaultCategory: 'Caçador', allowedCategories: ['Caçador', 'NPC', 'Inimigo/Oni'] },
    { id: 'techniques', name: 'Técnicas', icon: WindIcon, themeColor: 'techniques', defaultCategory: 'Respiração', allowedCategories: ['Respiração', 'Kekkijutsu'] },
    { id: 'locations', name: 'Mundo', icon: MapIcon, themeColor: 'locations', defaultCategory: 'Local/Cenário', allowedCategories: ['Local/Cenário', 'Evento', 'Missões'] },
    { id: 'alchemist', name: 'Prompts IA', icon: CauldronIcon, themeColor: 'alchemist' }, 
    { id: 'cosmaker', name: 'Visualizador', icon: ImageIcon, themeColor: 'cosmaker' },
    { id: 'filmmaker', name: 'Roteirista', icon: VideoIcon, themeColor: 'filmmaker' as any },
    { id: 'bard', name: 'Bardo', icon: MusicIcon, themeColor: 'bard' as any }, 
    { id: 'master_tools', name: 'Mestre', icon: BrainIcon, themeColor: 'master_tools' },
];
