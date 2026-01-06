// lib/breathingStylesCreation.ts

export const BREATHING_STYLE_CREATION_GUIDE = {
  title: "🌬️ CRIANDO SUA RESPIRAÇÃO",
  quote: "“Respirar é viver — mas dominar a respiração é se aproximar dos deuses.” — Registro dos Caçadores Anciãos",
  steps: [
    {
      title: "⚙️ 1. Conceito e Inspiração",
      content: "Toda Respiração nasce de uma emoção e um elemento natural ou simbólico.\nPergunte-se:\n- O que define o espírito do meu personagem?\n- Que aspecto da natureza ou conceito representa sua força interior?\nExemplo: Respiração da Cinza (resiliência e fogo extinto), Respiração da Serpente Lunar (astúcia e veneno espiritual), Respiração do Ferro (disciplina e impacto)."
    },
    {
      title: "🩸 2. Estrutura Básica",
      content: "Toda Respiração segue o mesmo formato de construção...",
      template: `
# RESPIRAÇÃO DO (NOME)
**Frase-Chave:** “...”
> - Conceito: ...
> - Estilo: ...`
    },
    {
      title: "🔢 3. Número de Formas",
      table: [
        { level: "Iniciante (1-5)", maxForms: "até 3 Formas", observation: "Técnicas básicas e funcionais" },
        { level: "Intermediário (6-10)", maxForms: "até 5 Formas", observation: "Introduz variações e efeitos combinados" },
        { level: "Avançado (11-15)", maxForms: "até 7 Formas", observation: "Cada forma tem efeito tático claro" },
        { level: "Hashira / Mestre (16-20)", maxForms: "até 9 Formas", observation: "Pode incluir “Forma Final” ou “Forma Proibida” (custo alto)" }
      ],
      note: "💡 Cada Forma deve ser uma técnica com função única (ataque, defesa, suporte, movimento, etc.)."
    },
    {
      title: "⚔️ 4. Estrutura das Formas",
      template: `
yaml
Forma X — (Nome da Forma)
Tipo de Ação: Padrão / Completa / Livre / Reação
Descrição: (breve descrição da técnica e movimento)

Nível 1: efeito básico | Custo: X PC
Nível 2: efeito aprimorado | Custo: X PC
Nível 3: efeito avançado | Custo: X PC
Nível 4: efeito supremo | Custo: X PC

Efeitos: (dano adicional, vantagem, debuff, cura, etc.)`
    },
    {
      title: "💨 5. Pontos de Concentração (PC) e Custos",
      content: "Cada Forma custa entre 1 e 5 PC, dependendo do impacto.\n- Formas de ação padrão custam de 1 a 2 PC.\n- Formas com múltiplos alvos ou efeitos de campo custam de 3 a 4 PC.\n- “Formas Proibidas” ou “Forma Final” podem custar 5+ PC e exigem teste de exaustão (MEN).\n⚠️ Quando o personagem fica com 0 PC, ele entra em estado de respiração irregular (desvantagem em testes físicos até recuperar 1 PC)."
    },
    {
      title: "🎯 6. Tipos de Ação",
      table: [
        { type: "Padrão", use: "Golpe direto ou ataque comum.", example: "Corte, estocada, investida." },
        { type: "Completa", use: "Técnica longa, envolve carga ou preparação.", example: "Dança, combo, explosão de energia." },
        { type: "Livre", use: "Ações rápidas ou reflexivas.", example: "Passo lateral, respiração curta, concentração." },
        { type: "Reação", use: "Executada fora do turno, responde a algo.", example: "Desviar, aparar, contra-atacar." }
      ]
    },
    {
      title: "🔮 7. Efeitos e Passivas",
      content: "Cada Respiração deve possuir 1 Passiva exclusiva, representando sua filosofia:\nExemplos:\n- Respiração da Neve — Passiva: Pureza Congelante → Vantagem em resistência a veneno e medo.\n- Respiração do Som — Passiva: Sinfonia Letal → +1 em iniciativa e reação a ruídos ocultos.\n- Respiração da Areia — Passiva: Instinto de Sobrevivência → reduz dano em áreas de terreno difícil."
    },
    {
      title: "⚖️ 8. Regras de Balanceamento",
      content: "- Nenhuma Forma deve causar dano instantâneo excessivo (ex: “mata em 1 turno”).\n- Evite empilhar múltiplos bônus permanentes.\n- Cada Forma deve ter uma fraqueza narrativa (curta duração, tempo de preparo, limitação ambiental, etc.).\n- Respirações derivadas (como Névoa, Flor, Fera, Serpente, etc.) devem herdar traços da Respiração Primária e modificá-los tematicamente."
    },
    {
      title: "📜 9. Aprovação do Mestre",
      content: "Antes de entrar em uso, toda Respiração criada deve ser aprovada pelo Mestre, avaliando:\n- Coerência temática (condiz com o mundo e o personagem?).\n- Equilíbrio mecânico (não quebra o sistema).\n- Originalidade e função tática.\n- Compatibilidade com Momentum e PC.\n\n🎴 Respiração criada sem aprovação é considerada instável e pode causar dano ao próprio usuário."
    }
  ],
  fullTemplate: `
# RESPIRAÇÃO DO (NOME)
**Frase-Chave:** “...”
> - Conceito: ...
> - Estilo: ...

**Número de Formas:** X
**Passiva:** ...

---

**Forma 1 – (Nome)**
**Tipo de Ação:** ...
**Descrição:** ...
**Nível 1:** ... | **Custo:** ... PC
**Nível 2:** ... | **Custo:** ... PC
**Nível 3:** ... | **Custo:** ... PC
**Nível 4:** ... | **Custo:** ... PC
**Efeitos:** ...

**Forma 2 – (Nome)**
(...seguir modelo acima...)

---

**Observação:**
Respiração criada e autorizada por (nome do Mestre).
Uso sem treinamento ou permissão pode causar exaustão, inconsciência ou colapso físico.`
};
