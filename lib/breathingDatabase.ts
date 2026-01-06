import React from 'react';
import { 
    DropletIcon, FlameIcon, FlowerIcon, BugIcon, HeartIcon, CloudIcon, MusicIcon, OniIcon,
    MountainIcon, ZapIcon, WindIcon, SerpentIcon, SunIcon, MoonIcon 
} from '../components/icons';

export interface BreathingStyleInfo {
    id: string;
    name: string;
    tag: string;
    icon: React.FC<{ className?: string }>;
    imageUrl: string;
    shortDesc: string;
    gradient: string;
    rarity: 'Rara' | 'Épica' | 'Lendária' | 'Mítica';
    category: 'Básica' | 'Derivada' | 'Especial' | 'Original';
    forms: number;
    difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Mestre' | 'Lendário' | 'Divino';
}

export const BREATHING_DATABASE: BreathingStyleInfo[] = [
  {
    id: 'water',
    name: 'Respiração da Água',
    tag: 'Técnica Fundamental',
    icon: DropletIcon,
    imageUrl: 'https://i.imgur.com/RUb5SMQ.jpg',
    shortDesc: 'Imita o fluxo, flexibilidade e adaptação da água. Movimentos suaves e contínuos.',
    gradient: 'from-blue-600 via-cyan-500 to-blue-700',
    rarity: 'Rara',
    category: 'Básica',
    forms: 11,
    difficulty: 'Intermediário'
  },
  {
    id: 'flame',
    name: 'Respiração das Chamas',
    tag: 'Técnica Fundamental',
    icon: FlameIcon,
    imageUrl: 'https://i.imgur.com/hJxdJ79.jpg',
    shortDesc: 'Evoca o calor e a fúria do fogo com ataques poderosos e singulares.',
    gradient: 'from-orange-600 via-red-500 to-yellow-600',
    rarity: 'Rara',
    category: 'Básica',
    forms: 9,
    difficulty: 'Avançado'
  },
  {
    id: 'thunder',
    name: 'Respiração do Trovão',
    tag: 'Técnica Fundamental',
    icon: ZapIcon,
    imageUrl: 'https://i.imgur.com/neCtaaD.jpg',
    shortDesc: 'Foca em velocidade relâmpago, com golpes estonteantes e explosivos.',
    gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
    rarity: 'Rara',
    category: 'Básica',
    forms: 7,
    difficulty: 'Avançado'
  },
  {
    id: 'wind',
    name: 'Respiração do Vento',
    tag: 'Técnica Fundamental',
    icon: WindIcon,
    imageUrl: 'https://i.imgur.com/bfJwGkA.jpg',
    shortDesc: 'Imita redemoinhos e torrentes de ar com cortes rotacionais rápidos.',
    gradient: 'from-green-400 via-teal-500 to-green-600',
    rarity: 'Rara',
    category: 'Básica',
    forms: 10,
    difficulty: 'Avançado'
  },
  {
    id: 'stone',
    name: 'Respiração da Pedra',
    tag: 'Técnica Fundamental',
    icon: MountainIcon,
    imageUrl: 'https://i.imgur.com/iNDUct7.jpg',
    shortDesc: 'Técnicas robustas que usam terreno e massa para ataques defensivos e poderosos.',
    gradient: 'from-gray-500 via-slate-600 to-gray-700',
    rarity: 'Rara',
    category: 'Básica',
    forms: 5,
    difficulty: 'Mestre'
  },
  {
    id: 'flower',
    name: 'Respiração da Flor',
    tag: 'Técnica Derivada',
    icon: FlowerIcon,
    imageUrl: 'https://i.imgur.com/KNN8dkk.jpg',
    shortDesc: 'Graciosa e letal, com golpes elegantes que priorizam agilidade e precisão.',
    gradient: 'from-pink-400 via-rose-500 to-pink-600',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 8,
    difficulty: 'Avançado'
  },
  {
    id: 'insect',
    name: 'Respiração do Inseto',
    tag: 'Técnica Derivada',
    icon: BugIcon,
    imageUrl: 'https://i.imgur.com/IQseS7V.jpg',
    shortDesc: 'Estocadas rápidas e precisas que aplicam venenos através de lâminas especiais.',
    gradient: 'from-purple-400 via-violet-500 to-fuchsia-600',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 5,
    difficulty: 'Mestre'
  },
  {
    id: 'love',
    name: 'Respiração do Amor',
    tag: 'Técnica Derivada',
    icon: HeartIcon,
    imageUrl: 'https://i.imgur.com/lrtwTfH.jpg',
    shortDesc: 'Movimentos sinuosos e expressivos que combinam graça e potência elástica.',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 8,
    difficulty: 'Avançado'
  },
  {
    id: 'mist',
    name: 'Respiração da Névoa',
    tag: 'Técnica Derivada',
    icon: CloudIcon,
    imageUrl: 'https://i.imgur.com/NYJZHXg.jpg',
    shortDesc: 'Imita a imprevisibilidade da névoa, com movimentos que ocultam a intenção.',
    gradient: 'from-sky-300 via-cyan-400 to-blue-400',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 7,
    difficulty: 'Avançado'
  },
  {
    id: 'sound',
    name: 'Respiração do Som',
    tag: 'Técnica Derivada',
    icon: MusicIcon,
    imageUrl: 'https://i.imgur.com/pZCRqPE.jpg',
    shortDesc: 'Canaliza a intensidade do som em explosões que desorientam e causam alto dano.',
    gradient: 'from-indigo-400 via-blue-500 to-purple-500',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 8,
    difficulty: 'Mestre'
  },
  {
    id: 'beast',
    name: 'Respiração da Besta',
    tag: 'Técnica Original',
    icon: OniIcon,
    imageUrl: 'https://i.imgur.com/m5g1SuC.jpg',
    shortDesc: 'Ataques diretos, ferozes e imprevisíveis, com ênfase em sentidos aguçados.',
    gradient: 'from-blue-gray-400 via-gray-500 to-slate-600',
    rarity: 'Épica',
    category: 'Especial',
    forms: 11,
    difficulty: 'Avançado'
  },
  {
    id: 'serpent',
    name: 'Respiração da Serpente',
    tag: 'Técnica Derivada',
    icon: SerpentIcon,
    imageUrl: 'https://i.imgur.com/NW9FwC8.jpg',
    shortDesc: 'Movimentos sinuosos e enganadores que contornam defesas e acertam pontos vitais.',
    gradient: 'from-violet-600 via-purple-700 to-indigo-700',
    rarity: 'Épica',
    category: 'Derivada',
    forms: 5,
    difficulty: 'Mestre'
  },
  {
    id: 'moon',
    name: 'Respiração da Lua',
    tag: 'Técnica Lendária',
    icon: MoonIcon,
    imageUrl: 'https://i.imgur.com/atm2tu7.jpg',
    shortDesc: 'Padrões de golpes em arcos crescentes, combinando ataque e defesa com ritmo caótico.',
    gradient: 'from-indigo-700 via-purple-800 to-slate-900',
    rarity: 'Lendária',
    category: 'Especial',
    forms: 20,
    difficulty: 'Lendário'
  },
  {
    id: 'sun',
    name: 'Respiração do Sol',
    tag: 'Técnica Original',
    icon: SunIcon,
    imageUrl: 'https://i.imgur.com/XYl63aQ.jpg',
    shortDesc: 'A respiração original. Um estilo ritualístico que se assemelha a uma dança contínua.',
    gradient: 'from-yellow-500 via-red-600 to-orange-700',
    rarity: 'Mítica',
    category: 'Original',
    forms: 13,
    difficulty: 'Divino'
  },
];