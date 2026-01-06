// lib/promptBuilder.ts
import type { FilterState } from '../types';

const THEMATIC_CONTEXT = `
## CONTEXTO VISUAL
Você opera dentro de uma interface inspirada em Demon Slayer com 6 abas temáticas.
Cada aba possui identidade visual única e atmosfera narrativa própria.

## SISTEMA DE ABAS (alfabético):

### 🗡️ CONFLITOS (Guerra) - #8B0000
**Atmosfera:** Tensa, épica, cinematográfica como arco Mugen Train
**Visual:** Chamas pulsantes, brasas flutuando, screen shake sutil
**Prompt base:** "Gere estratégia de batalha, guerra entre facções, cerco."

### ⚔️ FORJA (Itens) - #1C3E5A  
**Atmosfera:** Artesanal, detalhista, reverência pela forja de Haganezuka
**Visual:** Faíscas metálicas, brilho de Nichirin blade
**Prompt base:** "Crie arma, acessório ou consumível místico único."

### 📚 MESTRE (Tools) - #4A148C
**Atmosfera:** Sábia, analítica, como Ubuyashiki guiando os Hashira
**Visual:** Páginas de grimório, runas místicas flutuando
**Prompt base:** "Calcule XP (50-5000), sugira hook, balance encontro."

### 🗺️ MUNDO (Locações) - #1B5E20
**Atmosfera:** Exploratória, misteriosa, como Infinite Fortress
**Visual:** Folhas caindo, pétalas de wisteria, névoa
**Prompt base:** "Descreva vila, dungeon, região ou evento."

### 👤 PERSONAGENS - #E65100
**Atmosfera:** Carismática, profunda, backstories como de Rengoku
**Visual:** Aura de ki pulsante, energia vital circulando
**Prompt base:** "Desenvolva hunter, ninja ou NPC memorável."

### ⚡ TÉCNICAS - #F9A825
**Atmosfera:** Explosiva, dinâmica, formas de respiração em ação
**Visual:** Relâmpagos percorrendo, centelhas elétricas
**Prompt base:** "Invente breathing style, ninja art ou combo."

## DIRETRIZES NARRATIVAS:
1. Use referências de Demon Slayer quando apropriado.
2. Equilibre mecânicas de RPG com narrativa cinematográfica.
3. Crie momentos "dignos de animação da Ufotable".
4. Considere sinergias entre elementos gerados.
5. Mantenha tom imersivo e épico.

## RESTRIÇÕES:
- Conteúdo apropriado para RPG de mesa.
- Mecânicas balanceadas (evite power creep).
- NPCs com motivações claras.
- Itens têm contrapartidas (custo/limitação).
`;

const JSON_TEMPLATES: Record<string, string> = {
    'default': `
      "nome": "string (nome criativo e temático)", 
      "descricao_curta": "string (1-2 frases, máx 220 caracteres)", 
      "descricao": "string (lore detalhado e imersivo, 3-5 parágrafos, máx 2000 caracteres)", 
      "raridade": "string (Comum, Incomum, Rara, Épica, Lendária)", 
      "nivel_sugerido": "number (entre 1 e 20)", 
      "ganchos_narrativos": ["string", "string", "string (pelo menos 3 ganchos de aventura que possam inspirar uma sessão de RPG inteira)"], 
      "imagePromptDescription": "string (descrição visual detalhada em INGLÊS para IA de imagem, focada em estilo de arte, iluminação e composição, máx 500 caracteres)",
      "videoPromptDescription": "string (descrição cinematográfica em INGLÊS para IA de vídeo, focada em ação, movimento de câmera e atmosfera, máx 500 caracteres)"
    `,
    'Arma': `
      "nome": "string (nome criativo e temático)", 
      "descricao_curta": "string (1-2 frases, máx 220 caracteres)", 
      "descricao": "string (lore detalhado e imersivo, 3-5 parágrafos, máx 2000 caracteres)", 
      "raridade": "string (Comum, Incomum, Rara, Épica, Lendária)", 
      "nivel_sugerido": "number (entre 1 e 20)", 
      "ganchos_narrativos": ["string", "string", "string (pelo menos 3 ganchos de aventura)"], 
      "imagePromptDescription": "string (descrição visual detalhada em INGLÊS)",
      "videoPromptDescription": "string (descrição cinematográfica em INGLÊS)",
      "dano": "string", "dados": "string (formato 'XdY')", 
      "tipo_de_dano": "string", 
      "preco_sugerido": "number", 
      "efeitos_secundarios": "string (opcional)"
    `,
    'Caçador': `
      "nome": "string (nome criativo e temático)", 
      "descricao_curta": "string (1-2 frases, máx 220 caracteres)", 
      "descricao": "string (lore detalhado, 3-5 parágrafos)", 
      "raridade": "string (Comum, Incomum, Rara, Épica, Lendária)", 
      "nivel_sugerido": "number (entre 1 e 20)", 
      "ganchos_narrativos": ["string", "string", "string (pelo menos 3 ganchos)"], 
      "imagePromptDescription": "string (descrição visual detalhada em INGLÊS)",
      "videoPromptDescription": "string (descrição cinematográfica em INGLÊS)",
      "classe": "string (arquétipo, ex: Espadachim)", 
      "personalidade": "string (detalhada)", 
      "background": "string (história de origem detalhada)", 
      "respiracao": "string (Estilo de Respiração ou 'Nenhuma')", 
      "habilidade_especial": "string", 
      "estilo_de_luta": "string",
      "equipamento": [ { "nome": "string", "dano": "string", "tipo_de_dano": "string", "propriedade": "string" } ]
    `,
    'Inimigo/Oni': `
      "nome": "string (nome criativo)", 
      "descricao_curta": "string (1-2 frases)", 
      "descricao": "string (lore detalhado, 3-5 parágrafos)", 
      "raridade": "string (Comum, Incomum, Rara, Épica, Lendária)", 
      "nivel_sugerido": "number (1-20)", 
      "ganchos_narrativos": ["string", "string", "string (pelo menos 3 ganchos)"], 
      "imagePromptDescription": "string (descrição visual em INGLÊS)",
      "videoPromptDescription": "string (descrição cinematográfica em INGLÊS)",
      "power_level": "string (ex: Oni Inferior, Lua Inferior 3)", 
      "kekkijutsu": { "nome": "string", "descricao": "string (detalhada)", "tipo": "string (Ataque, Defesa, etc.)", "custo_pc": "number (1-5)" }, 
      "comportamento_combate": ["string", "string", "string (pelo menos 3 táticas)"]
    `,
    'Guerra de Clãs': `
      "titulo": "string (Ex: 'A Batalha do Desfiladeiro Escarlate')",
      "resumo_resultado": "string (Quem venceu e o custo da vitória)",
      "narrativa_batalha": "string (narrativa histórica e imersiva, 2-3 parágrafos)",
      "fases_batalha": [
        { "fase": "Início da Batalha", "descricao": "string" },
        { "fase": "Meio da Batalha", "descricao": "string (o clímax)" },
        { "fase": "Fim da Batalha", "descricao": "string" }
      ],
      "momentos_chave": ["string (ato heroico)", "string (duelo decisivo)", "string (erro trágico)"],
      "consequencias": {
        "para_vencedor": "string",
        "para_perdedor": "string",
        "para_regiao": "string"
      }
    `
};
JSON_TEMPLATES['Acessório'] = JSON_TEMPLATES['Arma'];
JSON_TEMPLATES['NPC'] = JSON_TEMPLATES['Caçador'];
JSON_TEMPLATES['Kekkijutsu'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['Respiração'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['Missões'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['Evento'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['Local/Cenário'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['Mitologia'] = JSON_TEMPLATES['default'];
JSON_TEMPLATES['História Antiga'] = JSON_TEMPLATES['default'];


/**
 * Builds a detailed prompt for the AI based on selected filters and new thematic context.
 */
export const buildPrompt = (filters: FilterState, promptModifier: string, expansionText?: string): string => {
    const { category } = filters;

    const jsonStructure = JSON_TEMPLATES[category] || JSON_TEMPLATES['default'];
    
    let prompt = (expansionText)
        ? `Você é um mestre artesão de RPG e especialista em balanceamento. Sua tarefa é pegar o texto narrativo fornecido e estruturá-lo perfeitamente no formato JSON abaixo. Corrija, melhore e preencha os campos ausentes para criar um item de RPG coeso e pronto para uso.`
        : `Você é um mestre de RPG e escritor criativo para o universo "Kimetsu Forge". Sua tarefa é gerar um conceito que se encaixe perfeitamente no sistema e na atmosfera descritos abaixo.`;
        
    prompt += `\n${THEMATIC_CONTEXT}\n\nA resposta DEVE ser um objeto JSON VÁLIDO, sem nenhum texto ou formatação adicional fora do JSON. A estrutura do JSON deve ser a seguinte:\n{${jsonStructure}}\n\n`;

    if (expansionText) {
        prompt += `Use o seguinte texto como material principal para preencher a estrutura. Seja fiel à narrativa, mas sinta-se à vontade para adicionar detalhes mecânicos (dano, nível, etc.) que façam sentido:\n\n---\n${expansionText}\n---\n`;
    }

    prompt += `Agora, gere o conteúdo com base nesta solicitação do usuário:\n- **Aba/Categoria Principal:** ${category}\n`;

    const specifications: string[] = [];
    if (category === 'Guerra de Clãs') {
        specifications.push(`- **Clã Atacante:** ${filters.attackingClan}`);
        specifications.push(`- **Clã Defensor:** ${filters.defendingClan}`);
        specifications.push(`- **Tamanho do Exército:** ${filters.armySize} por clã`);
        specifications.push(`- **Terreno:** ${filters.battleTerrain}`);
        specifications.push(`- **Estratégia do Atacante:** ${filters.battleStrategy}`);
    } else {
        specifications.push(`- **Raridade Desejada:** ${filters.rarity === 'Aleatória' ? 'decida a mais apropriada para o conceito' : filters.rarity}`);
        specifications.push(`- **Nível de Poder Sugerido:** Em torno de ${filters.level}`);
        if (filters.thematics.length > 0) specifications.push(`- **Temática(s):** ${filters.thematics.join(', ')}`);
        if (filters.country !== 'Aleatório') specifications.push(`- **Inspiração Cultural:** ${filters.country}`);
        if (filters.tonalidade !== 'Aleatória') specifications.push(`- **Tonalidade Narrativa:** ${filters.tonalidade}`);
    }

    if (specifications.length > 0) {
      prompt += specifications.join('\n');
    }

    if (promptModifier) {
        prompt += `\n- **Instrução Adicional do Usuário (Prioridade Alta):** "${promptModifier}". Use isso para guiar a geração.`;
    }
    
    prompt += `\n\nLembre-se: mergulhe na atmosfera da aba correspondente e produza APENAS o objeto JSON como resposta.`;

    return prompt;
};