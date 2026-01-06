
// lib/tonalidadeData.ts

export interface Tonalidade {
  nome: string;
  descricao: string;
}

export const TONALIDADE_DATA: Tonalidade[] = [
  { nome: "Aleatória", descricao: "Deixa a IA decidir a tonalidade mais apropriada." },
  { nome: "Épico e Heroico", descricao: "Foco em grandes feitos, bravura e sacrifício." },
  { nome: "Sombrio e Gótico", descricao: "Atmosfera de terror, suspense e melancolia." },
  { nome: "Misterioso e Oculto", descricao: "Segredos, conspirações e conhecimento proibido." },
  { nome: "Aventura e Exploração", descricao: "Viagens, descobertas e desafios em terras desconhecidas." },
  { nome: "Intriga e Política", descricao: "Conflitos de poder, traição e diplomacia." },
  { nome: "Sobrevivência e Desespero", descricao: "Luta pela vida em um mundo hostil." },
  { nome: "Folclórico e Mítico", descricao: "Lendas, contos de fadas e criaturas mitológicas." },
  { nome: "Honra e Tragédia", descricao: "Dilemas morais, dever e consequências inevitáveis." },
  { nome: "Extravagante e Artístico", descricao: "Visualmente rico, com foco em estética e criatividade exagerada." },
  { nome: "Dramático e Emocional", descricao: "Foco nos sentimentos, relações e conflitos internos dos personagens." }
];
