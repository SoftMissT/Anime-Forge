// lib/gameMechanicsData.ts
// This file contains core gameplay mechanics definitions for the RPG system.

export const CORE_ATTRIBUTES = {
    title: "Atributos Principais",
    description: "Os pilares que definem as capacidades de um personagem.",
    attributes: [
        { name: "Corpo (COR)", description: "Força física, resistência e vitalidade. Usado para ataques corpo a corpo, testes de Vigor e resistir a danos físicos." },
        { name: "Mente (MEN)", description: "Inteligência, raciocínio e força de vontade. Usado para investigação, percepção, resistir a controle mental e usar técnicas complexas." },
        { name: "Espírito (ESP)", description: "Conexão espiritual, intuição e poder interior. Governa a afinidade com a respiração, a resistência a corrupção demoníaca e a força da alma." },
        { name: "Agilidade (AGI)", description: "Velocidade, reflexos e coordenação. Usado para esquiva, iniciativa, ataques à distância e furtividade." },
    ]
};

export const COMBAT_RESOURCES = {
    title: "Recursos de Combate",
    description: "As energias que alimentam as ações e a sobrevivência em batalha.",
    resources: [
        { name: "Pontos de Vida (PV)", description: "Representa a saúde e a capacidade de suportar dano. Chegar a 0 PV resulta em incapacitação ou morte." },
        { name: "Pontos de Concentração (PC)", description: "Energia mental e espiritual usada para ativar as Formas (Kata) das Respirações e outras habilidades especiais. Recupera-se com descanso ou concentração." },
        { name: "Momentum", description: "Um recurso dinâmico ganho em combate por ações bem-sucedidas (acertos críticos, esquivas perfeitas, exploração de fraquezas). Pode ser gasto para ativar habilidades poderosas, realizar ações extras ou virar o jogo. O máximo é geralmente 5." }
    ]
};

export const COMBAT_MECHANICS = {
    title: "Mecânicas de Combate",
    description: "As regras que governam o fluxo de uma batalha.",
    mechanics: [
        { name: "Iniciativa", description: "Determina a ordem das ações no combate. Geralmente um teste de Agilidade." },
        { name: "Ações Padrão", description: "A ação principal de um personagem em seu turno, como Atacar, Usar uma Forma de Respiração, ou Ajudar um aliado." },
        { name: "Ações de Movimento", description: "Usado para se mover no campo de batalha." },
        { name: "Ações Bônus/Rápidas", description: "Ações menores que podem ser realizadas além da ação padrão, como sacar uma arma ou usar um item rápido." },
        { name: "Reações", description: "Ações realizadas fora do seu turno em resposta a um gatilho, como Aparar (Parry) um ataque ou uma Esquiva oportuna." },
        { name: "Testes de Acerto vs. Defesa/Esquiva", description: "Para acertar um alvo, o atacante rola um d20 + modificadores contra a classe de dificuldade (CD) da Defesa ou Esquiva do alvo." },
        { name: "Dano e Resistência", description: "O dano reduz os PV. Resistência reduz o dano sofrido pela metade, enquanto Vulnerabilidade o dobra." },
        { name: "Posturas (Kamae)", description: "Posições de combate que concedem bônus e penalidades específicas, alterando o estilo de luta. Trocar de postura pode custar uma ação." }
    ]
};

export const STATUS_CONDITIONS = {
    title: "Condições de Status",
    description: "Efeitos temporários, positivos ou negativos, que afetam um personagem.",
    conditions: [
        { name: "Atordoado (Stunned)", description: "Não pode realizar ações e tem desvantagem em testes de resistência." },
        { name: "Envenenado (Poisoned)", description: "Sofre dano contínuo e pode ter desvantagem em testes de atributo." },
        { name: "Exausto (Exhausted)", description: "Níveis de exaustão impõem penalidades cumulativas em todas as ações, podendo levar à morte." },
        { name: "Caído (Prone)", description: "Está no chão. Ataques corpo a corpo têm vantagem, ataques à distância têm desvantagem. Movimento é reduzido." },
        { name: "Cego (Blinded)", description: "Não pode ver. Falha em testes que dependem da visão e ataques contra si têm vantagem." },
        { name: "Assustado (Frightened)", description: "Desvantagem em testes de habilidade e ataque enquanto a fonte do medo estiver visível. Não pode se mover para mais perto da fonte." }
    ]
};
