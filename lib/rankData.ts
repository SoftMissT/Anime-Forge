// lib/rankData.ts

export const KENSHI_CLASS_DESCRIPTION = {
  class: '⚔️ Kenshi (Espadachim)',
  function: 'Linha de frente — ofensiva direta e técnica.',
  style: 'Disciplina, precisão e instinto.',
  role: 'Dano físico e pressão constante.'
};

export interface RankData {
  rank: string;
  level: string;
  title: string;
  benefits: string;
}

export const KENSHI_RANKS_DATA: RankData[] = [
  {
    rank: 'D',
    level: '1-2',
    title: 'Iniciante do Caminho',
    benefits: '+1 ataque corpo a corpo. Posturas básicas.'
  },
  {
    rank: 'C',
    level: '3-4',
    title: 'Espadachim Disciplinado',
    benefits: '+2 ataque. Pode aparar ataques leves (reação).'
  },
  {
    rank: 'B',
    level: '5-7',
    title: 'Instinto de Combate',
    benefits: '+2 ataque / +1 defesa. Contra-ataca após aparo.'
  },
  {
    rank: 'A',
    level: '8-10',
    title: 'Técnica Refinada',
    benefits: '+3 ataque. Escolhe um estilo (ex: Ittō-ryū, Nitō-ryū) com bônus situacional.'
  },
  {
    rank: 'S',
    level: '11-13',
    title: 'Alma da Batalha',
    benefits: '+3 ataque / +2 defesa. 1 técnica especial por descanso.'
  },
  {
    rank: 'SS',
    level: '14-16',
    title: 'Mestre do Fluxo',
    benefits: '+4 ataque / +4 defesa. Ignora penalidades por ferimentos leves.'
  },
  {
    rank: 'SSS',
    level: '17-19',
    title: 'Espírito Inquebrável',
    benefits: '+5 ataque. Pode agir 1 turno a 0 PV.'
  },
  {
    rank: 'SSS+',
    level: '20',
    title: 'Lenda Viva',
    benefits: '+6 ataque / +6 defesa. +1 ataque gratuito por turno mortal.'
  }
];

export const ALCHEMIST_CLASS_DESCRIPTION = {
  class: '⚗️ Alquimista',
  function: 'Suporte, utilitário e controle de campo.',
  style: 'Inteligência prática e improviso.',
  role: 'Cura, venenos e reforços táticos.'
};

export const ALCHEMIST_RANKS_DATA: RankData[] = [
  {
    rank: 'D',
    level: '1-2',
    title: 'Aprendiz',
    benefits: 'Poções simples (cura leve, resistência). Conhece venenos básicos.'
  },
  {
    rank: 'C',
    level: '3-4',
    title: 'Manipulador Preciso',
    benefits: 'Poções +10% eficácia. Identifica substâncias.'
  },
  {
    rank: 'B',
    level: '5-7',
    title: 'Alquimista Prático',
    benefits: 'Poções +20%. Cria toxinas fracas.'
  },
  {
    rank: 'A',
    level: '8-10',
    title: 'Mestre de Reações',
    benefits: 'Combina efeitos (cura + antídoto). Poções +30%.'
  },
  {
    rank: 'S',
    level: '11-13',
    title: 'Cientista de Campo',
    benefits: 'Cria bombas, granadas e antídotos instantâneos.'
  },
  {
    rank: 'SS',
    level: '14-16',
    title: 'Alquimia Viva',
    benefits: 'Venenos ignoram resistência. Poções curam ferimentos graves.'
  },
  {
    rank: 'SSS',
    level: '17-19',
    title: 'Transmutador Supremo',
    benefits: 'Transforma substâncias (ex: veneno -> cura) 1x/descanso.'
  },
  {
    rank: 'SSS+',
    level: '20',
    title: 'Criador de Essências',
    benefits: 'Cria elixires únicos (cura total, efeitos narrativos poderosos).'
  }
];

export const ESCUDEIRO_CLASS_DESCRIPTION = {
  class: '🛡️ Escudeiro (Tanque)',
  function: 'Defesa e resistência.',
  style: 'Foco, fé e proteção.',
  role: 'Atração de dano, suporte protetivo e resiliência.'
};

export const ESCUDEIRO_RANKS_DATA: RankData[] = [
    {
        rank: 'D',
        level: '1-2',
        title: 'Protetor Iniciante',
        benefits: '+1 Defesa. Pode dividir dano com aliado adjacente.'
    },
    {
        rank: 'C',
        level: '3-4',
        title: 'Guardião Consciente',
        benefits: '+2 defesa. Protege aliados em área curta.'
    },
    {
        rank: 'B',
        level: '5-7',
        title: 'Escudo Vivo',
        benefits: '+3 defesa. Pode interceptar ataques à distância (reação).'
    },
    {
        rank: 'A',
        level: '8-10',
        title: 'Muralha de Aço',
        benefits: '+4 defesa. Imune a empurrões/terreno difícil.'
    },
    {
        rank: 'S',
        level: '11-13',
        title: 'Bastião de Esperança',
        benefits: '+4 defesa. Resistência a dano Elemental leve.'
    },
    {
        rank: 'SS',
        level: '14-16',
        title: 'Fortaleza Espiritual',
        benefits: '+5 defesa. Resistência a medo/controle. Pode absorver dano alheio 1x/descanso.'
    },
    {
        rank: 'SSS',
        level: '17-19',
        title: 'Escudo Divino',
        benefits: '+6 defesa. Reduz 50% do dano por 1 turno crítico.'
    },
    {
        rank: 'SSS+',
        level: '20',
        title: 'O Inquebrável',
        benefits: '+7 defesa. Anula completamente 1 ataque mortal por combate.'
    }
];

export const VERSATIL_CLASS_DESCRIPTION = {
  class: '🌀 Não Especializado (Versátil)',
  function: 'Adaptável.',
  style: 'Improviso e criatividade.',
  role: 'Flexível, cobre lacunas táticas.'
};

export const VERSATIL_RANKS_DATA: RankData[] = [
  {
    rank: 'D',
    level: '1-2',
    title: 'Curioso do Mundo',
    benefits: 'Copia 25% dos bônus das outras classes.'
  },
  {
    rank: 'C',
    level: '3-4',
    title: 'Diletante',
    benefits: '35% dos bônus. Alterna papéis fora de combate.'
  },
  {
    rank: 'B',
    level: '5-7',
    title: 'Generalista',
    benefits: '40% dos bônus. Usa 1 técnica de outro arquétipo.'
  },
  {
    rank: 'A',
    level: '8-10',
    title: 'Adaptador Natural',
    benefits: '50% dos bônus. Copia técnica observada.'
  },
  {
    rank: 'S',
    level: '11-13',
    title: 'Virtuoso da Improvisação',
    benefits: '60% dos bônus. Muda estilo a cada turno.'
  },
  {
    rank: 'SS',
    level: '14-16',
    title: 'Espelho do Campo',
    benefits: '70% dos bônus. Usa 2 técnicas distintas.'
  },
  {
    rank: 'SSS',
    level: '17-19',
    title: 'Mestre das Mil Formas',
    benefits: '80% dos bônus. Contra-ataca com técnicas híbridas.'
  },
  {
    rank: 'SSS+',
    level: '20',
    title: 'Improvisador Perfeito',
    benefits: '90% dos bônus. Copia 1 habilidade completa por combate.'
  }
];

export const KISHI_CLASS_DESCRIPTION = {
  class: '🩸 KISHI - O DEMÔNIO GUERREIRO',
  function: 'corpo a corpo / duelista / destruição pura.',
  style: 'força bruta, regeneração e artes marciais demoníacas.'
};

export const KISHI_RANKS_DATA: RankData[] = [
    {
        rank: 'D',
        level: '1-2',
        title: 'Carne Desperta',
        benefits: '+1 em ataque corpo a corpo. Regenera ferimentos leves fora de combate.'
    },
    {
        rank: 'C',
        level: '3-4',
        title: 'Garras do Caçador Noturno',
        benefits: '+2 em ataque. Pode gerar garras demoníacas naturais (dano cortante).'
    },
    {
        rank: 'B',
        level: '5-7',
        title: 'Pele de Oni',
        benefits: '+3 em ataque e resistência leve a dano físico. Regenera lentamente em combate.'
    },
    {
        rank: 'A',
        level: '8-10',
        title: 'Fúria Contida',
        benefits: '+4 em ataque. Pode entrar em frenesi, aumentando o dano por 3 turnos, mas perdendo defesa.'
    },
    {
        rank: 'S',
        level: '11-13',
        title: 'Instinto da Caça',
        benefits: '+4 em ataque e +2 em defesa. Aumenta movimento e percepção de cheiros/sangue.'
    },
    {
        rank: 'SS',
        level: '14-16',
        title: 'Predador Alfa',
        benefits: '+5 em ataque. Pode perfurar defesas humanas e quebrar parrys.'
    },
    {
        rank: 'SSS',
        level: '17-19',
        title: 'Corpo da Carnificina',
        benefits: '+6 em ataque e regeneração total de membros perdidos após 1 turno.'
    },
    {
        rank: 'SSS+',
        level: '20',
        title: 'Rei do Massacre',
        benefits: '+7 em ataque e defesa. Regenera completamente a cada 3 turnos. Dano crítico ignora armadura.'
    }
];

export const DOKU_CLASS_DESCRIPTION = {
  class: '🕷️ DOKU — O ALQUIMISTA DEMONÍACO',
  function: 'venenos, infecção, manipulação de carne e sangue.',
  style: 'alquimia orgânica — cria toxinas, mutações e armas biológicas.'
};

export const DOKU_RANKS_DATA: RankData[] = [
    {
        rank: 'D',
        level: '1-2',
        title: 'Sangue Impuro',
        benefits: 'Pode secretar toxina leve (enjoo, dor).'
    },
    {
        rank: 'C',
        level: '3-4',
        title: 'Venenoso Adaptado',
        benefits: 'Venenos aplicam penalidade pequena à força e percepção.'
    },
    {
        rank: 'B',
        level: '5-7',
        title: 'Mestre da Infecção',
        benefits: 'Pode espalhar veneno em área (nuvem curta). Cria 1 tipo de toxina personalizada.'
    },
    {
        rank: 'A',
        level: '8-10',
        title: 'Alquimia de Carne',
        benefits: 'Pode combinar toxinas (ex.: paralisia + dor = torpor). Regenera aliados demoníacos com sangue.'
    },
    {
        rank: 'S',
        level: '11-13',
        title: 'Corpo Reagente',
        benefits: 'Cada ferimento sofrido gera nova toxina. Pode lançar venenos de dentro do próprio corpo.'
    },
    {
        rank: 'SS',
        level: '14-16',
        title: 'Engenheiro da Corrupção',
        benefits: 'Cria toxinas que corroem armas e selos de caçadores. Pode fortalecer venenos com sangue de Kizuki.'
    },
    {
        rank: 'SSS',
        level: '17-19',
        title: 'Heresia Biológica',
        benefits: 'Pode transformar aliados em versões mutadas temporárias. Resistência natural a antídotos humanos.'
    },
    {
        rank: 'SSS+',
        level: '20',
        title: 'O Sangue Que Devora',
        benefits: 'Toxinas têm consciência. Qualquer inimigo envenenado por você pode ser consumido à distância para curar totalmente seu corpo.'
    }
];

export const GUREN_CLASS_DESCRIPTION = {
  class: '🛡️ GUREN - O DEFENSOR DEMONÍACO',
  function: 'tanque, protetor e regenerador.',
  style: 'endurecimento da carne, multiplicação de camadas, escudos ósseos.'
};

export const GUREN_RANKS_DATA: RankData[] = [
    {
        rank: 'D',
        level: '1-2',
        title: 'Casca Demoníaca',
        benefits: '+1 em defesa. Ganha resistência leve a cortes.'
    },
    {
        rank: 'C',
        level: '3-4',
        title: 'Placas de Osso',
        benefits: '+2 em defesa. Pode reduzir dano de ataques físicos diretos.'
    },
    {
        rank: 'B',
        level: '5-7',
        title: 'Pele de Ferro Vivo',
        benefits: '+3 em defesa. Regenera mesmo sob ataque.'
    },
    {
        rank: 'A',
        level: '8-10',
        title: 'Guarda Monstruosa',
        benefits: '+4 em defesa. Pode proteger aliados Onis próximos.'
    },
    {
        rank: 'S',
        level: '11-13',
        title: 'Armadura de Carne',
        benefits: '+4 em defesa e resistência a fogo/luz fraca. Ganha regeneração acelerada.'
    },
    {
        rank: 'SS',
        level: '14-16',
        title: 'Núcleo Inquebrável',
        benefits: '+5 em defesa. Pode absorver um golpe letal e sobreviver com 1 PV.'
    },
    {
        rank: 'SSS',
        level: '17-19',
        title: 'Bastião Infernal',
        benefits: '+6 em defesa. Rebate parte do dano recebido em ataques corpo a corpo.'
    },
    {
        rank: 'SSS+',
        level: '20',
        title: 'O Guardião Abissal',
        benefits: '+7 em defesa e regeneração instantânea. Pode absorver dano de aliados Onis e convertê-lo em Ki demoníaco.'
    }
];

export const KAGE_CLASS_DESCRIPTION = {
  class: 'KAGE - O MUTANTE / MÍSTICO',
  function: 'versátil, adaptativo, manipulador de Ki demoníaco e habilidades híbridas.',
  style: 'absorve conhecimento e poderes de outras criaturas — é o reflexo instável do “Não Especializado”.'
};

export const KAGE_RANKS_DATA: RankData[] = [
    {
        rank: 'D',
        level: '1-2',
        title: 'Ecos de Carne',
        benefits: 'Aprende pequenas técnicas físicas (ataque básico, salto).'
    },
    {
        rank: 'C',
        level: '3-4',
        title: 'Imitação Instintiva',
        benefits: 'Copia movimentos simples observados em combate.'
    },
    {
        rank: 'B',
        level: '5-7',
        title: 'Mimetismo Demoníaco',
        benefits: 'Acessa 25% dos bônus de outra classe Oni.'
    },
    {
        rank: 'A',
        level: '8-10',
        title: 'Mutação Adaptativa',
        benefits: 'Acessa 40% dos bônus de outra classe Oni. Pode alternar forma menor (ex: braço extra, olhos extras).'
    },
    {
        rank: 'S',
        level: '11-13',
        title: 'Corpo Mutável',
        benefits: 'Acessa 50% dos bônus das outras classes Oni. Pode mudar de forma temporariamente para ganhar uma habilidade.'
    },
    {
        rank: 'SS',
        level: '14-16',
        title: 'Alma Fragmentada',
        benefits: 'Acessa 60% dos bônus de outras classes Oni. Pode manifestar duas mutações simultâneas.'
    },
    {
        rank: 'SSS',
        level: '17-19',
        title: 'Abominação Perfeita',
        benefits: 'Acessa 75% dos bônus de outras classes Oni. Pode copiar técnicas humanas observadas brevemente.'
    },
    {
        rank: 'SSS+',
        level: '20',
        title: 'O Sem Forma',
        benefits: 'Acessa 90% dos bônus de qualquer classe (Oni ou Humana). Pode reconfigurar o corpo completamente por 1 cena escolhendo que tipo de criatura quer ser.'
    }
];