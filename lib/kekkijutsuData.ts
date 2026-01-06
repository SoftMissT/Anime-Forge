// lib/kekkijutsuData.ts

export const KEKKIJUTSU_CREATION_RULES = {
  title: "🩸 REGRAS DE CRIAÇÃO — KEKKIJUTSU (Habilidade de Sangue Demoníaco)",
  baseConcept: {
    title: "⚙️ 1. Conceito Base",
    description: "Cada Oni possui 1 a 3 Kekkijutsus, definidos pelo seu nível (Rank) e pela natureza do seu sangue. Essas habilidades derivam da essência do Oni — sua origem, emoção dominante e método de alimentação. Exemplo: um Oni movido por inveja pode copiar poderes, um movido por medo cria ilusões, um movido por ódio gera chamas ou destruição."
  },
  structure: {
    title: "🔥 3. Estrutura de um Kekkijutsu",
    description: "Cada Kekkijutsu deve conter:",
    points: [
      "Nome: Algo simbólico ou ritualístico (ex: “Flor Carmesim”, “Chama do Lamento”, “Olhos do Abismo”).",
      "Descrição: O tipo de poder e sua origem emocional.",
      "Tipo: Ataque, Defesa, Controle, Suporte ou Campo.",
      "Custo de PC: De 1 a 5, dependendo do impacto.",
      "Teste de Resistência: Oponentes podem resistir com Vontade ou Reflexo.",
      "Efeito Mecânico: O que realmente muda em combate (dano, debuff, vantagem, manipulação, etc.).",
      "Efeito Narrativo: O impacto fora de combate (corromper terreno, alterar percepção, invocar espíritos, etc.)."
    ],
    example: "“Olho da Lua Profana” (Controle / Ilusão)\nCusto: 3 PC\nEfeito: O Oni prende até 2 alvos em uma ilusão onde o tempo passa 10x mais rápido. Eles ficam confusos (–2 em testes) por 2 turnos.\nNarrativo: o ambiente distorce, os reflexos aparecem distorcidos, e o alvo sente o próprio medo materializar-se."
  },
  combatRules: {
    title: "🧠 5. Regras de Uso em Combate",
    rules: [
      "Um Oni pode usar 1 Kekkijutsu por turno (ação padrão).",
      "Pode gastar +1 PC para estender ou intensificar o efeito.",
      "Se ficar com PC = 0, o Oni entra em “Fúria Sanguínea”: ganha +2 em ataque, mas perde 2 PV por turno.",
      "Kekkijutsus com efeitos de campo (ex: névoa, maldição, escuridão) duram 3 turnos ou até o Oni ser interrompido.",
      "Habilidades narrativas (rituais, invocações, portais) precisam de 1 turno de concentração e podem ser interrompidas."
    ]
  },
  creationSteps: {
    title: "💉 6. Criação de um Novo Kekkijutsu (Jogador ou Mestre)",
    steps: [
      "1. Defina o tema emocional do Oni (ex: inveja, orgulho, desespero, luxúria).",
      "2. Escolha um elemento base ou conceito (ex: sangue, sombra, som, doença, tempo, marionetes).",
      "3. Escolha o tipo mecânico (Ataque / Defesa / Controle / Suporte / Campo).",
      "4. Dê um custo de PC coerente com o impacto (1–5).",
      "5. Descreva o efeito de forma clara, pensando no uso prático e narrativo.",
      "6. Equilibre: Kekkijutsus fortes devem ter uma fraqueza natural (ex: vulnerável à luz, purificação, respiração específica)."
    ]
  }
};

export interface KekkijutsuQuantityByRank {
  rank: string;
  level: string;
  quantity: string;
  observations: string;
}

export const KEKKIJUTSU_QUANTITY_BY_RANK: KekkijutsuQuantityByRank[] = [
  { rank: "Rank D", level: "Oni fraco / recém-transformado", quantity: "1 (básico)", observations: "Uma habilidade simples de efeito direto (ataque ou defesa)" },
  { rank: "Rank C", level: "Oni comum", quantity: "1–2", observations: "Pode ter variação tática (ex: ataque e mobilidade)" },
  { rank: "Rank B", level: "Oni de elite / Mini-Chefe", quantity: "2", observations: "Habilidades complementares e sinérgicas" },
  { rank: "Rank A", level: "Oni superior menor", quantity: "2–3", observations: "Pode usar uma habilidade por turno sem penalidade" },
  { rank: "Rank S", level: "Oni de Nível Lua Inferior", quantity: "3", observations: "Ganha acesso a \"versões aprimoradas\" de Kekkijutsu" },
  { rank: "Rank SS", level: "Oni de Nível Lua Superior", quantity: "3–4", observations: "Kekkijutsus complexos e narrativos, podem alterar o campo de batalha" },
  { rank: "Rank SSS", level: "Oni Lendário / Apóstolo", quantity: "4", observations: "Capazes de afetar tempo, espaço, sanidade, etc." },
  { rank: "Rank SSS+", level: "Oni Divino / Cavaleiro", quantity: "4–5", observations: "Cada Kekkijutsu tem potencial catastrófico; efeito global" }
];

export interface KekkijutsuMastery {
  domain: string;
  requirement: string;
  effect: string;
}

export const KEKKIJUTSU_MASTERY_LEVELS: KekkijutsuMastery[] = [
  { domain: "Inicial", requirement: "Rank D–C", effect: "A habilidade se manifesta de forma instintiva e limitada." },
  { domain: "Aprimorado", requirement: "Rank B–A", effect: "O Oni controla o poder conscientemente, podendo variar intensidade." },
  { domain: "Avançado", requirement: "Rank S–SS", effect: "Pode combinar dois efeitos ou usá-lo como reação." },
  { domain: "Supremo", requirement: "Rank SSS–SSS+", effect: "O Kekkijutsu se torna uma força natural, distorcendo leis físicas e espirituais." }
];

export interface KekkijutsuExample {
  name: string;
  type: 'Ataque' | 'Campo' | 'Controle' | 'Suporte' | 'Defesa';
  cost: string;
  effect: string;
}

export const KEKKIJUTSU_EXAMPLES: KekkijutsuExample[] = [
  { name: "Sangue Corrosivo", type: "Ataque", cost: "2 PC", effect: "O sangue do Oni derrete armas e carne. Causa dano contínuo por 2 turnos." },
  { name: "Chamas do Inferno Branco", type: "Campo", cost: "3 PC", effect: "Cria fogo espiritual que cega e causa dano mental. Afeta aliados e inimigos." },
  { name: "Lamento da Carne", type: "Controle", cost: "3 PC", effect: "Faz o corpo da vítima trair seus próprios movimentos. –2 em ataque e defesa." },
  { name: "Lágrima do Caos", type: "Suporte", cost: "2 PC", effect: "Restaura 1d6 PV e remove um efeito negativo. Deixa o Oni com desvantagem no próximo teste." },
  { name: "Espelho de Sangue", type: "Defesa", cost: "2 PC", effect: "Reflete o primeiro golpe recebido, mas o Oni perde metade do dano refletido." }
];