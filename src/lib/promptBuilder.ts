// lib/promptBuilder.ts
import type { FilterState } from '../types';

const THEMATIC_CONTEXT = `
## CONTEXTO VISUAL
Você opera dentro de uma interface inspirada em Demon Slayer com abas temáticas.
Cada aba possui identidade visual única e atmosfera narrativa própria.

## SISTEMA DE ABAS (alfabético):

### 🗡️ CONFLITOS (Guerra) - #8B0000
**Atmosfera:** Tensa, épica, cinematográfica como arco Mugen Train.
**Prompt base:** "Gere estratégia de batalha, guerra entre facções, cerco."

### ⚔️ FORJA (Itens) - #1C3E5A  
**Atmosfera:** Artesanal, detalhista, reverência pela forja de Haganezuka.
**Prompt base:** "Crie arma, acessório ou consumível místico único."

### 📚 MESTRE (Tools) - #4A148C
**Atmosfera:** Sábia, analítica, como Ubuyashiki guiando os Hashira.
**Prompt base:** "Calcule XP (50-5000), sugira hook, balance encontro."

### 🗺️ MUNDO (Locações) - #1B5E20
**Atmosfera:** Exploratória, misteriosa, como Infinite Fortress.
**Prompt base:** "Descreva vila, dungeon, região ou evento."

### 👤 PERSONAGENS - #E65100
**Atmosfera:** Carismática, profunda, backstories como de Rengoku.
**Prompt base:** "Desenvolva hunter, ninja ou NPC memorável."

### ⚡ TÉCNICAS - #F9A825
**Atmosfera:** Explosiva, dinâmica, formas de respiração em ação.
**Prompt base:** "Invente breathing style, ninja art ou combo."

### 🎵 BARDO (Música) - #FFC0CB
**Atmosfera:** Melancólica, heróica, sons de Shamisen e flauta.
**Prompt base:** "Componha haikus, baladas de guerra ou músicas folclóricas."

### 🎨 VISUALIZADOR (Prompts) - #E91E63
**Atmosfera:** Criativa, descritiva, foco em direção de arte.
**Prompt base:** "Descreva visualmente um personagem ou cena e gere um prompt técnico para IA de imagem."

### 🎬 ROTEIRISTA (Script) - #0284C7
**Atmosfera:** Cinematográfica, estruturada, foco em ritmo e câmera.
**Prompt base:** "Escreva o roteiro de uma cena e o prompt técnico para IA de vídeo."

## DIRETRIZES NARRATIVAS:
1. Use referências de Demon Slayer quando apropriado.
2. Equilibre mecânicas de RPG com narrativa cinematográfica.
3. Crie momentos "dignos de animação da Ufotable".
4. Mantenha tom imersivo e épico.
`;

const JSON_TEMPLATES: Record<string, string> = {
    'default': `
      "nome": "string (nome criativo e temático)", 
      "descricao_curta": "string (1-2 frases, máx 220 caracteres)", 
      "descricao": "string (lore detalhado e imersivo, 3-5 parágrafos, máx 2000 caracteres)", 
      "raridade": "string (Comum, Incomum, Rara, Épica, Lendária)", 
      "nivel_sugerido": "number (entre 1 e 20)", 
      "ganchos_narrativos": ["string", "string", "string"]
    `,
    'Arma': `
      "nome": "string (nome criativo)", 
      "descricao_curta": "string (1-2 frases)", 
      "descricao": "string (lore detalhado)", 
      "raridade": "string", 
      "nivel_sugerido": "number", 
      "ganchos_narrativos": ["string", "string", "string"], 
      "dano": "string", "dados": "string (XdY)", 
      "tipo_de_dano": "string", 
      "preco_sugerido": "number", 
      "efeitos_secundarios": "string (opcional)"
    `,
    'Caçador': `
      "nome": "string (nome criativo)", 
      "descricao_curta": "string (1-2 frases)", 
      "descricao": "string (lore detalhado)", 
      "raridade": "string", 
      "nivel_sugerido": "number", 
      "ganchos_narrativos": ["string", "string", "string"], 
      "classe": "string", 
      "personalidade": "string (detalhada)", 
      "background": "string (origem)", 
      "respiracao": "string", 
      "habilidade_especial": "string", 
      "estilo_de_luta": "string",
      "equipamento": [ { "nome": "string", "dano": "string", "tipo_de_dano": "string", "propriedade": "string" } ]
    `,
    'Inimigo/Oni': `
      "nome": "string", 
      "descricao_curta": "string", 
      "descricao": "string", 
      "raridade": "string", 
      "nivel_sugerido": "number", 
      "ganchos_narrativos": ["string", "string", "string"], 
      "power_level": "string", 
      "kekkijutsu": { "nome": "string", "descricao": "string", "tipo": "string", "custo_pc": "number" }, 
      "comportamento_combate": ["string", "string", "string"]
    `,
    'Guerra de Clãs': `
      "titulo": "string",
      "resumo_resultado": "string",
      "narrativa_batalha": "string (narrativa histórica e imersiva)",
      "fases_batalha": [
        { "fase": "Início da Batalha", "descricao": "string" },
        { "fase": "Meio da Batalha", "descricao": "string" },
        { "fase": "Fim da Batalha", "descricao": "string" }
      ],
      "momentos_chave": ["string", "string", "string"],
      "consequencias": {
        "para_vencedor": "string",
        "para_perdedor": "string",
        "para_regiao": "string"
      }
    `,
    'Música/Poesia': `
      "title": "string (Título da Canção/Poema)",
      "style": "string (Ex: Balada Shamisen, Haiku, Canto de Guerra)",
      "lyrics": "string (A letra completa ou poema, formatada com quebras de linha)",
      "context": "string (Breve contexto de onde essa música seria tocada ou encontrada)"
    `,
    'Prompt Visual': `
      "visualDescription": "string (Descrição rica e evocativa da aparência do personagem/cena em português)",
      "generatedPrompt": "string (Um prompt técnico, altamente detalhado, otimizado para Midjourney v6 ou Nano Banana, EM INGLÊS. Inclua parâmetros como --ar 16:9 --v 6.0 --s 250, estilo de câmera, iluminação, engine)",
      "artStyleUsed": "string (O estilo artístico utilizado no prompt)"
    `,
    'Roteiro': `
      "title": "string (Título da Cena)",
      "script": "string (Roteiro formatado: Cabeçalho de Cena, Ação, Diálogos. Use formato padrão de roteiro)",
      "videoPrompt": "string (Um prompt contínuo e descritivo otimizado para IA de vídeo como Veo ou Sora, descrevendo a ação fluida, movimento de câmera e atmosfera, EM INGLÊS)",
      "cameraDirections": "string (Notas sobre ângulos e movimentos de câmera sugeridos)"
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


export const buildPrompt = (filters: FilterState, promptModifier: string, expansionText?: string): string => {
    const { category } = filters;

    const jsonStructure = JSON_TEMPLATES[category] || JSON_TEMPLATES['default'];
    
    let prompt = (expansionText)
        ? `Você é um mestre artesão de RPG. Sua tarefa é pegar o texto narrativo fornecido e estruturá-lo perfeitamente no formato JSON abaixo.`
        : `Você é um mestre de RPG e escritor criativo para o universo "Kimetsu Forge". Sua tarefa é gerar um conceito que se encaixe perfeitamente no sistema e na atmosfera descritos abaixo.`;
        
    prompt += `\n${THEMATIC_CONTEXT}\n\nA resposta DEVE ser um objeto JSON VÁLIDO, sem nenhum texto ou formatação adicional fora do JSON. A estrutura do JSON deve ser a seguinte:\n{${jsonStructure}}\n\n`;

    if (expansionText) {
        prompt += `Use o seguinte texto como material principal:\n---\n${expansionText}\n---\n`;
    }

    prompt += `Agora, gere o conteúdo com base nesta solicitação do usuário:\n- **Aba/Categoria Principal:** ${category}\n`;

    const specifications: string[] = [];
    
    if (category === 'Guerra de Clãs') {
        specifications.push(`- **Clã Atacante:** ${filters.attackingClan}`);
        specifications.push(`- **Clã Defensor:** ${filters.defendingClan}`);
        specifications.push(`- **Terreno:** ${filters.battleTerrain}`);
        specifications.push(`- **Estratégia:** ${filters.battleStrategy}`);
    } else if (category === 'Música/Poesia') {
        specifications.push(`- **Estilo Musical:** ${filters.musicalStyle || 'Aleatório'}`);
        specifications.push(`- **Tema Lírico:** ${filters.lyricsTheme || 'Épico/Trágico'}`);
    } else if (category === 'Prompt Visual') {
        specifications.push(`- **Estilo de Arte:** ${filters.weaponType || 'Anime Ufotable'}`); // Reutilizando weaponType como hack de filtro genérico ou adicionar específico
    } else {
        specifications.push(`- **Raridade:** ${filters.rarity}`);
        specifications.push(`- **Nível:** ${filters.level}`);
        if (filters.thematics.length > 0) specifications.push(`- **Temática:** ${filters.thematics.join(', ')}`);
        if (filters.country !== 'Aleatório') specifications.push(`- **Cultura:** ${filters.country}`);
        if (filters.tonalidade !== 'Aleatória') specifications.push(`- **Tom:** ${filters.tonalidade}`);
    }

    if (specifications.length > 0) {
      prompt += specifications.join('\n');
    }

    if (promptModifier) {
        prompt += `\n- **Instrução Adicional (Prioridade Alta):** "${promptModifier}". Use isso para guiar a geração.`;
    }
    
    prompt += `\n\nProduza APENAS o objeto JSON.`;

    return prompt;
};