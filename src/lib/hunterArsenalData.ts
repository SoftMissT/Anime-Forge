// lib/hunterArsenalData.ts

export interface HunterArsenalWeapon {
  nome: string;
  descricao: string;
  critico: string;
  tipo_de_dano: string;
  propriedade: string;
  dano: string;
}

export const HUNTER_ARSENAL_DATA: HunterArsenalWeapon[] = [
  // Armas Corpo a Corpo
  { nome: "Alabarda", descricao: "Arma de haste versátil europeia", critico: "20", tipo_de_dano: "Cortante", propriedade: "Versátil", dano: "7" },
  { nome: "Cimitarra", descricao: "Lâmina curvada exótica", critico: "19", tipo_de_dano: "Cortante", propriedade: "Corte Giratório", dano: "6" },
  { nome: "Cutelos Gêmeos", descricao: "Par de cutelos pesados", critico: "20", tipo_de_dano: "Cortante", propriedade: "Ataque Duplo", dano: "5 (cada)" },
  { nome: "Escudo de Batalha", descricao: "Escudo grande", critico: "19", tipo_de_dano: "Contundente", propriedade: "Defesa Superior", dano: "4" },
  { nome: "Espada Ondular", descricao: "Lâmina com fio ondulado", critico: "20", tipo_de_dano: "Cortante", propriedade: "Sangramento Severo", dano: "6" },
  { nome: "Foice", descricao: "Lâmina curva agrícola", critico: "19", tipo_de_dano: "Cortante", propriedade: "Gancho de Combate", dano: "6" },
  { nome: "Hook Shuang", descricao: "Ganchos duplos", critico: "18", tipo_de_dano: "Cortante/Perfurante", propriedade: "Agarrar Mortal", dano: "4 (cada)" },
  { nome: "Hwando", descricao: "Sabre curvado coreano, ágil e letal", critico: "19", tipo_de_dano: "Cortante", propriedade: "Corte Fluído", dano: "6" },
  { nome: "Jian", descricao: "Espada reta de duplo fio", critico: "20", tipo_de_dano: "Cortante/Perfurante", propriedade: "Versátil", dano: "5" },
  { nome: "Kamas", descricao: "Foice de mão", critico: "19", tipo_de_dano: "Cortante", propriedade: "Gancho de Combate", dano: "4 cada" },
  { nome: "Katana", descricao: "Lâmina curva do samurai, equilibrada entre corte e velocidade", critico: "20", tipo_de_dano: "Cortante", propriedade: "Balanceada", dano: "6" },
  { nome: "Katana Chicote", descricao: "Lâmina segmentada extensível", critico: "19", tipo_de_dano: "Cortante", propriedade: "Alcance Flexível", dano: "5" },
  { nome: "Katana Ferrão", descricao: "Katana para estocadas com compartimento de veneno", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Perfuração Profunda", dano: "5" },
  { nome: "Katana Serrilhada", descricao: "Katana com serrilhas", critico: "20", tipo_de_dano: "Cortante", propriedade: "Sangramento Grave", dano: "8" },
  { nome: "Kusarigama", descricao: "Foice com corrente", critico: "19-20", tipo_de_dano: "Cortante/Contundente", propriedade: "Alcance Flexível", dano: "5" },
  { nome: "Machado de Batalha", descricao: "Machado pesado de duas mãos", critico: "20", tipo_de_dano: "Cortante", propriedade: "Corte Brutal", dano: "8" },
  { nome: "Manoplas/Soqueiras", descricao: "Reforço para golpes", critico: "19", tipo_de_dano: "Contundente", propriedade: "Soco Rápido", dano: "5 cada" },
  { nome: "Montante", descricao: "Espada de campo enorme", critico: "20", tipo_de_dano: "Cortante", propriedade: "Varredura Larga", dano: "10" },
  { nome: "Nagamaki", descricao: "Haste com lâmina muito longa", critico: "20", tipo_de_dano: "Cortante", propriedade: "Varredura Horizontal", dano: "7" },
  { nome: "Naginata", descricao: "Haste japonesa com lâmina curva", critico: "19", tipo_de_dano: "Cortante", propriedade: "Alcance Superior", dano: "6" },
  { nome: "Nunchaku", descricao: "Bastões conectados", critico: "18", tipo_de_dano: "Contundente", propriedade: "Combinação Rápida", dano: "4" },
  { nome: "Ono & Mangual", descricao: "Combinação machado e mangual", critico: "20", tipo_de_dano: "Cortante/Contundente", propriedade: "Combinação Brutal", dano: "8 (machado) / 5 (esfera)" },
  { nome: "Qiang", descricao: "Lança chinesa com penacho decorativo, equilibrada para estocadas rápidas e controle de distância", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Estocada Rápida", dano: "6" },
  { nome: "Rapieira", descricao: "Espada de estocada focada em velocidade", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Estocada Rápida", dano: "4" },
  { nome: "Runkah", descricao: "Lança tradicional coreana com ponta afiada e versátil", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Alcance médio / Estocada rápida", dano: "6" },
  { nome: "Tetsubo", descricao: "Bastão de ferro pesado", critico: "19-20", tipo_de_dano: "Contundente", propriedade: "Quebra-Armadura", dano: "9" },
  { nome: "Tessen", descricao: "Leque de guerra", critico: "19", tipo_de_dano: "Contundente", propriedade: "Distração Elegante", dano: "3" },
  { nome: "Woldo", descricao: "Alabarda coreana com lâmina lunada característica, perfeita para varreduras amplas", critico: "19", tipo_de_dano: "Cortante", propriedade: "Alcance Estendido", dano: "7" },
  { nome: "Zweihänder", descricao: "Espada gigante alemã", critico: "20", tipo_de_dano: "Cortante", propriedade: "Corte Devastador", dano: "9" },

  // Armas a Distância
  { nome: "Arco Longo", descricao: "Arco tradicional de longo alcance", critico: "19", tipo_de_dano: "Perfurante", propriedade: "Tiro Longo", dano: "5" },
  { nome: "Balestra", descricao: "Arma de disparo potente", critico: "20", tipo_de_dano: "Perfurante", propriedade: "Penetração", dano: "5" },
  { nome: "Chakram", descricao: "Par de Discos de metal cortante", critico: "18", tipo_de_dano: "Cortante", propriedade: "Ricochete", dano: "3 cada" },
  { nome: "Escopeta Cano Duplo", descricao: "Espingarda de dois canos", critico: "20", tipo_de_dano: "Perfurante", propriedade: "Disparo Duplo", dano: "6" },
  { nome: "Fuuma Shuriken", descricao: "Shuriken gigante", critico: "19", tipo_de_dano: "Cortante", propriedade: "Corte Giratório", dano: "6" },
  { nome: "Ioiô de Lâmina", descricao: "Lâmina circular retrátil", critico: "19-20", tipo_de_dano: "Cortante", propriedade: "Ataque Retrátil", dano: "4" },
  { nome: "Kunai", descricao: "Adaga de arremesso", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Arremesso Preciso", dano: "4" },
  { nome: "Revólver", descricao: "Arma de fogo rápida", critico: "18", tipo_de_dano: "Perfurante", propriedade: "Disparo Rápido", dano: "4" },
  { nome: "Rifle", descricao: "Rifle de pólvora de alto impacto", critico: "19", tipo_de_dano: "Perfurante", propriedade: "Tiro Preciso", dano: "8" },
  { nome: "Tomahawk", descricao: "Machados de arremesso", critico: "19-20", tipo_de_dano: "Cortante", propriedade: "Arremesso Preciso", dano: "4 (cada)" },
  { nome: "Chicote", descricao: "Chicote com ponta metálica", critico: "20", tipo_de_dano: "Cortante", propriedade: "Alcance Estendido", dano: "5" }
];
