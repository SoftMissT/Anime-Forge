// lib/originsData.ts

export interface OriginData {
  nome: string;
  conceito: string;
  mecanica: string;
  atributos: string;
}

export const ORIGINS_DATA: OriginData[] = [
  {
    nome: "Tsuguko - Herdeiro do Pilar",
    conceito: "O discípulo direto de um Hashira, carregando o peso do legado.",
    mecanica: `Pode "imitar" o mestre por 3 turnos para ganhar bônus (+1d4).
Pode gastar todo o Momentum (5) para um Ataque Extra Devastador, mas fica exausto por um turno.
Ataque Extra Devastador:
Após gastar todo o Momentum (5) para um ataque extra (Forma bônus) muito poderoso, com +2 de acerto e +1 dado de dano.`,
    atributos: "PV 10 / PC 9",
  },
  {
    nome: "Samurai - Honra Acima de Tudo",
    conceito: "O guerreiro que vive pelo Bushidō.",
    mecanica: `Defesa Passiva:
Ganha +1 em defesa e vantagem contra Medo/Intimidação (enquanto honrado). Se quebrar o código, perde os bônus até se redimir.
Golpe de Vingança:
Um ataque muito forte (+3 acerto, +2 dados de dano) que pode ser usado quando você está com menos de 5% de PV ou um aliado cai (gastando 3 de Momentum).`,
    atributos: "PV 13 / PC 6",
  },
  {
    nome: "Ninja - A Sombra Silenciosa",
    conceito: "O mestre da furtividade, emboscada e venenos.",
    mecanica: `Imunidade:
Resistência passiva a veneno e a chance de anular completamente um efeito de veneno ou paralisia (1x/dia).
Ataque Mortal:
Um golpe devastador (+3 acerto, ignora armadura, +1 dado de dano) contra alvos que não o viram. (gasta 2 PC/Momentum).`,
    atributos: "PV 12 / PC 8",
  },
  {
    nome: "Isolado - O Sobrevivente Primal",
    conceito: "O eremita que aprendeu com a natureza.",
    mecanica: `Resiliência Extrema:
+2 PV base permanente, resiste a fadiga/dor e pode ignorar um teste de resistência falho (1x/dia).
Reação Rápida: Age primeiro em emboscadas.
Defesa Instintiva:
Pode refazer um teste de esquiva ou percepção (1x/combate).`,
    atributos: "PV 15 / PC 4",
  },
  {
    nome: "Civilizado - O Mestre da Lábia",
    conceito: "Criado na cidade, usa a política e a conversa como armas.",
    mecanica: `Mestre Social:
Vantagem em testes de Persuasão, Enganação e Intimidação.
Controle de Multidão:
Pode "falar" para distrair um inimigo, mudando seu foco (1x/cena).
Mobilidade Urbana:
Ganha +1 de Esquiva em cidades e pode se reposicionar (gasto de 1 PC).`,
    atributos: "PV 7 / PC 5",
  },
  {
    nome: "Descendente Perdido - O Sangue Antigo",
    conceito: "Carrega o poder adormecido de um clã esquecido.",
    mecanica: `Aprendiz Rápido:
Aprende novas Respirações na metade do tempo.
Versatilidade:
Ganha bônus de dano (+1d6) ou uma ação extra na primeira vez que usa uma Forma nova.
Suporte:
Pode "marcar" aliados para dar bônus de iniciativa e +1 em um teste.
Utilidade:
Sente a presença de demônios passivamente.`,
    atributos: "PV 12 / PC 10",
  },
  {
    nome: "Estrangeiro - O Estilo Exótico",
    conceito: "Veio de terras distantes com técnicas de luta únicas.",
    mecanica: `Quebra-Defesa:
Pode ignorar a resistência de um inimigo (1x/dia)
Aprendiz Rápido:
Também aprende novas formas mais rápido (metade do tempo) e causa +1d6 de dano na primeira vez que a usa.
Utilidade Social:
Bônus (+2) para lidar com outras culturas ou estrangeiros.`,
    atributos: "PV 11 / PC 8",
  },
  {
    nome: "Monge (O Pilar Espiritual)",
    conceito: "Devoto da fé, focado em purificação e proteção.",
    mecanica: `Cura em Área: Pode ativar uma aura (Ação Bônus) que cura aliados próximos (1d6 PV).
Debuff em Área: A mesma aura dá desvantagem nos ataques dos inimigos.
Controle de Inimigo: Possui um ataque especial que causa dano sagrado e aplica debuffs (lentidão/atordoamento).`,
    atributos: "PV 8 / PC 10",
  },
  {
    nome: "Treinado por Ex-Hashira (O Legado Traumatizado)",
    conceito: "Treinado por uma lenda aposentada; herdou sua técnica e seus traumas.",
    mecanica: `O "Refazer":
A habilidade de refazer uma rolagem (ataque, defesa, etc.) que tenha falhado (1x/descanso curto).
Golpe Amplificado:
Pode gastar 3 Momentum para um "super golpe" (+1d dano, +2 acerto) que também aplica um efeito extra (atordoar, empurrar, etc.).`,
    atributos: "PV 10 / PC 7",
  },
  {
    nome: "Militar (O Tático de Campo)",
    conceito: "Disciplinado e focado em estratégia de equipe.",
    mecanica: `Suporte de Equipe:
Pode (como Ação Bônus) dar bônus de ataque ou defesa (+1) para até 3 aliados.
Buff Ofensivo:
Pode gastar Momentum para melhorar o bônus acima, dando dano extra (+1d) aos aliados.
Debuff Tático:
Possui um ataque focado que, além de dar mais dano, enfraquece o ataque e a velocidade do inimigo.`,
    atributos: "PV: 13 PC: 6",
  }
];