// lib/tabsData.ts
import React from 'react';
// FIX: Import all icons from the barrel file
import { AnvilIcon, UsersIcon, WindIcon, MapIcon, SwordsIcon, BrainIcon, CauldronIcon, ImageIcon, VideoIcon } from '../components/icons';
import type { AppView, Category } from '../types';

export interface TabConfig {
    id: AppView;
    name: string;
    icon: React.FC<{ className?: string }>;
    defaultCategory?: Category;
    allowedCategories?: Category[];
    themeColor: 'forge' | 'characters' | 'techniques' | 'locations' | 'conflicts' | 'master_tools' | 'alchemist' | 'cosmaker' | 'filmmaker';
}

export const TABS_DATA: TabConfig[] = [
    { id: 'conflicts', name: 'Conflitos', icon: SwordsIcon, themeColor: 'conflicts', defaultCategory: 'Guerra de Clãs' },
    { id: 'forge', name: 'Forja', icon: AnvilIcon, themeColor: 'forge', defaultCategory: 'Arma', allowedCategories: ['Arma', 'Acessório'] },
    { id: 'alchemist', name: 'Alquimia', icon: CauldronIcon, themeColor: 'alchemist' },
    { id: 'cosmaker', name: 'Cosmaker', icon: ImageIcon, themeColor: 'cosmaker' },
    { id: 'filmmaker', name: 'Filmmaker', icon: VideoIcon, themeColor: 'filmmaker' as any },
    { id: 'master_tools', name: 'Mestre', icon: BrainIcon, themeColor: 'master_tools' },
    { id: 'locations', name: 'Mundo', icon: MapIcon, themeColor: 'locations', defaultCategory: 'Local/Cenário', allowedCategories: ['Local/Cenário', 'Evento', 'Missões'] },
    { id: 'characters', name: 'Personagens', icon: UsersIcon, themeColor: 'characters', defaultCategory: 'Caçador', allowedCategories: ['Caçador', 'NPC', 'Inimigo/Oni'] },
    { id: 'techniques', name: 'Técnicas', icon: WindIcon, themeColor: 'techniques', defaultCategory: 'Respiração', allowedCategories: ['Respiração', 'Kekkijutsu'] },
];