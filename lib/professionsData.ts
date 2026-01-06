// lib/professionsData.ts
import type { Tematica } from '../types';

export const PROFESSIONS_BY_TEMATICA: Record<string, string[]> = {
    'Aleatória': ['Aleatória', 'Ferreiro', 'Caçador', 'Mercador', 'Estalajadeiro', 'Monge', 'Artista', 'Guarda'],
    'Período Edo (Japão Feudal)': [
        'Aleatória', 'Samurai', 'Ninja', 'Ronin', 'Monge Guerreiro', 'Ferreiro de Katanas', 'Comerciante', 'Gueixa', 'Daimyo', 'Agricultor de Arroz', 'Pescador', 'Artista de Ukiyo-e'
    ],
    'Medieval Fantasia': [
        'Aleatória', 'Cavaleiro', 'Mago', 'Ladrão', 'Clérigo', 'Bardo', 'Ferreiro', 'Alquimista', 'Guarda da Cidade', 'Caçador de Monstros', 'Nobre', 'Escriba'
    ],
    'Steampunk': [
        'Aleatória', 'Engenheiro Mecânico', 'Inventor', 'Aviador', 'Detetive Particular', 'Relojoeiro', 'Operário de Fábrica', 'Capitão de Dirigível', 'Jornalista'
    ],
    'Cyberpunk': [
        'Aleatória', 'Netrunner (Hacker)', 'Samurai de Rua (Mercenário)', 'Técnico de Cibertecnologia', 'Detetive Corporativo', 'Contrabandista de Dados', 'Membro de Gangue', 'Jornalista de Mídia Alternativa'
    ],
    'Pós-apocalíptico': [
        'Aleatória', 'Saqueador', 'Catador de Sucata', 'Líder de Acampamento', 'Mecânico de Veículos', 'Mutante', 'Batedor', 'Curandeiro Tribal', 'Comerciante Carvaneiro'
    ],
    'Shogunato Cibernético': [
        'Aleatória', 'Samurai Cibernético', 'Ninja de Dados', 'Tecno-Monge', 'Engenheiro de Mechas', 'Contrabandista de IA', 'Yakuza da Rede', 'Gueixa Androide'
    ],
    'all': [ // Fallback 'all' category
        'Aleatória', 'Ferreiro', 'Caçador', 'Mercador', 'Estalajadeiro', 'Monge', 'Artista', 'Guarda', 'Samurai', 'Ninja', 'Cavaleiro', 'Mago', 'Engenheiro', 'Netrunner', 'Saqueador', 'Ronin', 'Detetive', 'Aviador', 'Clérigo', 'Bardo', 'Alquimista'
    ]
};