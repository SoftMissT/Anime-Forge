// lib/itemCreationGuide.ts

export const ITEM_CREATION_GUIDE = {
  title: "📜 GUIA DE CRIAÇÃO DE ITENS",
  quote: "“A alma de uma lenda muitas vezes reside no aço que ela empunha ou no talismã que a protege.”",
  steps: [
    {
      title: "1. Conceito e Temática",
      content: "Todo item lendário começa com uma história. Qual é a origem deste item? Quem o forjou? Que evento marcante está ligado a ele? A temática deve se alinhar ao mundo (ex: Japão Feudal, Fantasia Sombria, Steampunk).",
    },
    {
      title: "2. Raridade e Nível",
      content: "A raridade determina o poder base e a complexidade do item. O nível sugerido deve ser consistente com a raridade.",
      table: [
        { rarity: "Comum (Nível 1-4)", description: "Itens funcionais, bem feitos, mas sem propriedades mágicas." },
        { rarity: "Incomum (Nível 5-8)", description: "Possui um bônus simples (+1) ou uma propriedade menor (ex: brilha perto de Onis)." },
        { rarity: "Rara (Nível 9-12)", description: "Bônus significativos (+2) ou uma habilidade ativada uma vez por dia." },
        { rarity: "Épica (Nível 13-16)", description: "Poderes que mudam o jogo, múltiplos bônus e habilidades únicas." },
        { rarity: "Lendária (Nível 17-20)", description: "Artefatos com história própria, capazes de alterar o destino." },
      ]
    },
    {
      title: "3. Propriedades Mecânicas",
      content: "Defina o que o item faz em termos de regras.",
      points: [
        "**Bônus Passivos:** Aumentos em atributos, dano, defesa ou perícias (ex: +2 em Força).",
        "**Habilidades Ativadas:** Poderes que podem ser usados um número limitado de vezes (ex: 'Uma vez por dia, pode lançar uma bola de fogo').",
        "**Efeitos de Gatilho:** Habilidades que ativam sob certas condições (ex: 'Ao sofrer um golpe crítico, você se teleporta 3 metros').",
        "**Maldições:** Itens poderosos podem ter desvantagens para equilibrar seu poder (ex: 'Causa 1d4 de dano ao usuário a cada uso')."
      ]
    },
    {
      title: "4. Descrição e Ganchos Narrativos",
      content: "Dê vida ao item com descrições vívidas e lore. Crie pelo menos 3 ganchos narrativos para integrá-lo à campanha.",
      example: `
**Gancho 1:** A lâmina emite um brilho fraco na presença de seu antigo dono, cuja alma ainda está presa em uma fortaleza amaldiçoada.
**Gancho 2:** Um coletor de artefatos raros ouviu falar do item e fará de tudo para obtê-lo, seja por negociação ou à força.
**Gancho 3:** O material do qual o item é feito é a única chave para selar um portal demoníaco que está se abrindo nas proximidades.`
    },
    {
      title: "5. Preço e Disponibilidade",
      content: "Itens comuns podem ser encontrados em lojas, enquanto itens raros ou lendários são recompensas de missões, encontrados em masmorras antigas ou precisam ser forjados com materiais exóticos. O preço deve refletir sua raridade e poder."
    }
  ]
};
