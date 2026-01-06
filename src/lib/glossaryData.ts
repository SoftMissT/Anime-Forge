// lib/glossaryData.ts

export interface GlossaryTerm {
    name: string;
    definition: string;
    sourcePage: number;
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
    { name: "Atributos", definition: "Os pilares que definem as capacidades de um personagem: Corpo, Mente, Espírito e Agilidade.", sourcePage: 6 },
    { name: "Corpo (COR)", definition: "Atributo que representa força física, resistência e vitalidade.", sourcePage: 6 },
    { name: "Mente (MEN)", definition: "Atributo que representa inteligência, raciocínio e força de vontade.", sourcePage: 6 },
    { name: "Espírito (ESP)", definition: "Atributo que governa a afinidade com a respiração, a resistência à corrupção e a força da alma.", sourcePage: 6 },
    { name: "Agilidade (AGI)", definition: "Atributo que representa velocidade, reflexos e coordenação.", sourcePage: 6 },
    { name: "Pontos de Vida (PV)", definition: "Representa a saúde e a capacidade de suportar dano.", sourcePage: 7 },
    { name: "Pontos de Concentração (PC)", definition: "Energia mental e espiritual usada para ativar as Formas (Kata) das Respirações.", sourcePage: 7 },
    { name: "Momentum", definition: "Recurso dinâmico ganho em combate por ações bem-sucedidas, usado para ativar habilidades poderosas.", sourcePage: 11 },
    { name: "Formas (Kata)", definition: "As técnicas ou habilidades específicas de um estilo de Respiração.", sourcePage: 27 },
    { name: "Kekkijutsu", definition: "Habilidade de Sangue Demoníaco, um poder sobrenatural único para cada Oni.", sourcePage: 48 },
    { name: "Lâmina Nichirin", definition: "Espadas forjadas com um minério especial que absorve a luz do sol, a única arma capaz de decapitar permanentemente um Oni.", sourcePage: 13 },
    { name: "Marca do Caçador", definition: "Uma marca misteriosa que pode aparecer em Caçadores de Demônios poderosos, concedendo habilidades sobre-humanas com um alto custo.", sourcePage: 22 },
    { name: "Mundo Transparente", definition: "Uma habilidade avançada que permite ao usuário ver os músculos, o fluxo sanguíneo e os movimentos de seus oponentes, prevendo seus ataques.", sourcePage: 23 },
    { name: "Lâmina Carmesim", definition: "Uma técnica onde um Caçador com a Marca pode tornar sua lâmina Nichirin vermelho-brilhante, dificultando a regeneração de um Oni.", sourcePage: 25 },
    { name: "Oni", definition: "Demônios que se alimentam de humanos para sobreviver e se fortalecer. Possuem regeneração e habilidades sobrenaturais (Kekkijutsu).", sourcePage: 44 },
    { name: "Hashira (Pilar)", definition: "Os nove espadachins mais poderosos do Esquadrão de Caçadores de Demônios.", sourcePage: 16 },
];
