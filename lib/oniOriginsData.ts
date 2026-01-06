// lib/oniOriginsData.ts

export interface OniOriginData {
  nome: string;
  conceito: string;
  mecanica: string;
}

export const ONI_ORIGINS_DATA: OniOriginData[] = [
  {
    nome: "Vingança Inacabada",
    conceito: "Um humano traído ou assassinado que retornou como Oni para buscar vingança.",
    mecanica: "Ganha bônus de dano contra alvos que se assemelham ao seu algoz do passado. Possui habilidades de rastreamento aprimoradas."
  },
  {
    nome: "Fome Insaciável",
    conceito: "Um indivíduo que morreu de fome e cuja obsessão por comida o transformou em um Oni com um apetite sem fim.",
    mecanica: "Pode consumir partes de inimigos para regenerar vida rapidamente. Suas habilidades são focadas em devorar e absorver."
  },
  {
    nome: "Artista Amaldiçoado",
    conceito: "Um artista (pintor, escultor, músico) cuja paixão pela arte se tornou uma obsessão doentia, transformando-o em um Oni que distorce a realidade.",
    mecanica: "Utiliza Kekkijutsu baseado em ilusões, manipulação de cores, sons ou formas para confundir e atacar seus oponentes."
  },
  {
    nome: "Guerreiro Caído",
    conceito: "Um guerreiro formidável que, no leito de morte, amaldiçoou sua fraqueza e aceitou o sangue de um demônio para continuar lutando para sempre.",
    mecanica: "Mantém sua proficiência marcial. Seu Kekkijutsu aprimora suas técnicas de combate, como criar lâminas de sangue ou endurecer a pele como aço."
  },
  {
    nome: "Experimento Falho",
    conceito: "Uma cobaia de experimentos com sangue de demônio que deu errado, resultando em uma criatura instável e grotesca.",
    mecanica: "Possui mutações imprevisíveis. Em combate, pode manifestar novas habilidades ou fraquezas aleatoriamente."
  },
  {
    nome: "Guardião Corrompido",
    conceito: "Um monge ou protetor de um local sagrado que sucumbiu à escuridão para proteger seu santuário, tornando-se a própria ameaça que jurou combater.",
    mecanica: "Usa uma versão sombria de suas antigas habilidades sagradas. Seu Kekkijutsu pode envolver corrupção de área ou controle de espíritos."
  }
];
