// pages/api/generate.ts
import { NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from '@google/genai';
import { sessionOptions } from '../../lib/session';
// FIX: Import CONFLICT_SCALES
import { CONFLICT_SCALES } from '../../constants';

/**
 * Extracts the first complete JSON object or array from a string.
 * It handles nested structures by balancing brackets.
 * @param str The string to search within.
 * @returns The extracted JSON string, or null if not found.
 */
const extractFirstJson = (str: string): string | null => {
    let firstOpen: number = -1;
    let openChar: '{' | '[' | '' = '';

    const firstCurly = str.indexOf('{');
    const firstSquare = str.indexOf('[');

    if (firstCurly !== -1 && (firstCurly < firstSquare || firstSquare === -1)) {
        firstOpen = firstCurly;
        openChar = '{';
    } else if (firstSquare !== -1) {
        firstOpen = firstSquare;
        openChar = '[';
    }

    if (firstOpen === -1) {
        return null; // No JSON object/array found
    }

    const closeChar = openChar === '{' ? '}' : ']';
    let balance = 1; // Start with 1 for the first open character found

    for (let i = firstOpen + 1; i < str.length; i++) {
        if (str[i] === openChar) {
            balance++;
        } else if (str[i] === closeChar) {
            balance--;
        }

        if (balance === 0) {
            return str.substring(firstOpen, i + 1);
        }
    }

    return null; // Unbalanced JSON
};


/**
 * Parses a JSON string that might be wrapped in markdown code fences or have extraneous text.
 * @param jsonString The raw string from the AI response.
 * @returns The parsed JSON object or array.
 * @throws An error if parsing fails.
 */
function safeJsonParse(jsonString: string): any {
    let parsableString = jsonString.trim();

    // First, try to find markdown fences, as they are explicit.
    const markdownMatch = /```(?:json)?\s*([\s\S]*?)\s*```/.exec(parsableString);
    if (markdownMatch && markdownMatch[1]) {
        parsableString = markdownMatch[1].trim();
    } else {
        // If no markdown, use the robust extractor to find the first valid JSON structure.
        const extractedJson = extractFirstJson(parsableString);
        if (extractedJson) {
            parsableString = extractedJson;
        }
    }

    try {
        return JSON.parse(parsableString);
    } catch (e) {
        console.error("Original string that failed parsing:", jsonString);
        console.error("Attempted to parse:", parsableString);
        console.error("Parsing error:", e);
        throw new Error("A resposta da IA não estava em um formato JSON válido e não pôde ser corrigida.");
    }
}

// FIX: The handler is now an inline async function passed directly to `withIronSessionApiRoute`.
// This allows TypeScript to correctly infer the type of `req` and include the `session` property.
export default withIronSessionApiRoute(async function generateRoute(req, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (!process.env.API_KEY) {
        console.error("A variável de API do Google Gemini (API_KEY) não está configurada no ambiente do servidor.");
        return res.status(500).json({ message: "Erro de configuração do servidor: A chave de API para o serviço de IA não foi encontrada." });
    }

    // Basic auth check
    if (!req.session.user || !req.session.user.isLoggedIn) {
        return res.status(401).json({ message: 'Não autorizado. Por favor, faça login.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const { view, filters } = req.body;
        let result;

        switch (view) {
            case 'forge':
                result = await handleForge(filters, ai);
                break;
            case 'conflicts':
                result = await handleConflicts(filters, ai);
                break;
            case 'characters':
                result = await handleCharacters(filters, ai);
                break;
            case 'techniques':
                result = await handleTechniques(filters, ai);
                break;
            case 'locations':
                result = await handleLocations(filters, ai);
                break;
            case 'master_tools':
                result = await handleMasterTools(filters, ai);
                break;
            case 'alchemist':
                result = await handleAlchemist(filters, ai);
                break;
            case 'cosmaker':
                result = await handleCosmaker(filters, ai);
                break;
             case 'filmmaker':
                result = await handleFilmmaker(filters, ai);
                break;
            default:
                return res.status(400).json({ message: 'View inválida ou não suportada.' });
        }

        res.status(200).json(result);

    } catch (error: any) {
        console.error(`[API /api/generate] Erro na view '${req.body.view}':`, error);
        res.status(500).json({ message: error.message || 'Ocorreu um erro interno no servidor.' });
    }
}, sessionOptions);

// --- Handlers for each view ---

const handleForge = async (filters: any, ai: GoogleGenAI) => {
    const { category, rarity, level, thematics, country, era, tonalidade, promptModifier, quantity } = filters;
    const fullPrompt = `
      Você é um mestre contador de histórias e especialista no universo de Kimetsu no Yaiba.
      Sua tarefa é gerar ${quantity} ideia(s) criativa(s) com base nos seguintes parâmetros:
      - Categoria: ${category}
      - Raridade: ${rarity}
      - Nível Sugerido: ${level}
      - Temática(s): ${thematics.join(', ') || 'Nenhuma'}
      - Inspiração Cultural: ${country} / ${era}
      - Tonalidade: ${tonalidade}
      - Instrução Adicional: ${promptModifier}
      Gere uma resposta em formato JSON. A resposta DEVE ser um array de objetos JSON, mesmo que a quantidade seja 1. Cada objeto deve ter um título ("title") e uma descrição ("description").
    `;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ['title', 'description']
                }
            },
            temperature: 0.8,
        }
    });
    
    let parsedResult = safeJsonParse(result.text);

    // Safeguard: if the model ignores instructions and returns a single object, wrap it in an array.
    if (!Array.isArray(parsedResult)) {
        parsedResult = [parsedResult];
    }
    
    return parsedResult;
};

const handleConflicts = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, scale, missionType, factions, addPlotTwist } = filters;
    const plotTwistText = addPlotTwist ? 'Adicionalmente, inclua uma reviravolta (plot twist) inesperada na sinopse.' : '';
    const scaleLabel = CONFLICT_SCALES.find(s => s.value === scale)?.label || 'Batalha Regional';

    const fullPrompt = `
      Você é um mestre roteirista para o universo de Kimetsu no Yaiba.
      Sua tarefa é gerar um conflito original com base nos parâmetros:
      - Objetivo: ${prompt}
      - Escala: ${scaleLabel}
      - Tipo de Missão: ${missionType?.label}
      - Facções Envolvidas: ${factions.map((f: any) => f.label).join(', ')}
      Gere uma sinopse detalhada. ${plotTwistText}. Retorne um objeto JSON.
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", contents: fullPrompt, config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                synopsis: { type: Type.STRING },
                scale: { type: Type.STRING },
                missionType: { type: Type.STRING },
                factionsInvolved: { type: Type.STRING }
            }, required: ['name', 'synopsis', 'scale', 'missionType', 'factionsInvolved']
        }}
    });
    return safeJsonParse(result.text);
};

const handleCharacters = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, affiliation, rank, personalityTraits, generateUniqueAbility } = filters;
    const abilityText = generateUniqueAbility ? `Crie uma ${affiliation.value === 'demon' ? 'Arte Demoníaca de Sangue (Kekkijutsu)' : 'Técnica de Respiração'} completamente nova.` : 'Use habilidades comuns para a afiliação.';
    const fullPrompt = `
      Crie um personagem de Kimetsu no Yaiba.
      - Conceito: ${prompt}
      - Afiliação: ${affiliation?.label}
      - Classe: ${rank?.label || 'Não especificado'}
      - Personalidade: ${personalityTraits.map((p: any) => p.label).join(', ') || 'Deixe a IA decidir'}
      - Habilidades: ${abilityText}
      Gere um personagem completo com nome, aparência, personalidade, história e habilidades. Retorne um objeto JSON.
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", contents: fullPrompt, config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT, properties: {
                name: { type: Type.STRING }, affiliation: { type: Type.STRING }, rank: { type: Type.STRING },
                appearance: { type: Type.STRING }, personality: { type: Type.STRING },
                backstory: { type: Type.STRING }, abilities: { type: Type.STRING }
            }, required: ['name', 'affiliation', 'rank', 'appearance', 'personality', 'backstory', 'abilities']
        }}
    });
    return safeJsonParse(result.text);
};

const handleTechniques = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, type, baseElement, complexity, generateNotableUser } = filters;
    const notableUserText = generateNotableUser ? 'Adicionalmente, crie um parágrafo descrevendo um usuário notável (original) desta técnica.' : '';
    const fullPrompt = `
        Crie uma técnica de combate de Kimetsu no Yaiba.
        - Conceito: ${prompt}
        - Tipo: ${type?.label}
        - Elemento: ${baseElement?.label}
        - Complexidade: ${complexity?.label}
        Gere uma descrição detalhada da técnica e suas formas. ${notableUserText} Retorne um objeto JSON.
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", contents: fullPrompt, config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT, properties: {
                name: { type: Type.STRING }, type: { type: Type.STRING },
                baseElement: { type: Type.STRING }, description: { type: Type.STRING }
            }, required: ['name', 'type', 'baseElement', 'description']
        }}
    });
    return safeJsonParse(result.text);
};

const handleLocations = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, biome, atmosphere, generatePointsOfInterest } = filters;
    const pointsOfInterestText = generatePointsOfInterest ? 'Adicionalmente, liste e descreva 3 a 5 pontos de interesse únicos neste local.' : '';
    const fullPrompt = `
      Crie um local para Kimetsu no Yaiba.
      - Conceito: ${prompt}
      - Bioma: ${biome?.label}
      - Atmosfera: ${atmosphere?.label}
      Gere uma descrição rica do local. ${pointsOfInterestText} Retorne um objeto JSON.
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", contents: fullPrompt, config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT, properties: {
                name: { type: Type.STRING }, biome: { type: Type.STRING },
                atmosphere: { type: Type.STRING }, description: { type: Type.STRING },
                pointsOfInterest: { type: Type.STRING }
            }, required: ['name', 'biome', 'atmosphere', 'description', 'pointsOfInterest']
        }}
    });
    return safeJsonParse(result.text);
};

const handleMasterTools = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, toolType, category, genre, soundType, quantity } = filters;
    let subCategory = '', instruction = '';
    switch (toolType.value) {
        case 'name_generator':
            subCategory = `para a categoria "${category?.label}"`;
            instruction = `Gere uma lista de ${quantity} nomes japoneses únicos.`;
            break;
        case 'plot_hook_generator':
            subCategory = `para o gênero "${genre?.label}"`;
            instruction = `Gere uma lista de ${quantity} ganchos de trama (plot hooks) curtos e intrigantes.`;
            break;
        case 'onomatopoeia_generator':
            subCategory = `para sons de "${soundType?.label}"`;
            instruction = `Gere uma lista de ${quantity} onomatopeias japonesas (em romaji com tradução/contexto).`;
            break;
    }
    const fullPrompt = `
      Você é um assistente criativo. Use a ferramenta: "${toolType.label}".
      Contexto: "${prompt}". ${instruction} ${subCategory}.
      Retorne APENAS a lista como um array de strings em JSON.
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", contents: fullPrompt, config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }}
    });
    return safeJsonParse(result.text);
};

const handleAlchemist = async (filters: any, ai: GoogleGenAI) => {
    const { systemInstruction, prompt, model, temperature, topP, topK } = filters;
    const result = await ai.models.generateContent({
        model: model.value as string,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction || undefined,
            temperature, topP, topK,
        }
    });
    return { response: result.text };
};

const handleCosmaker = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, artStyle, characterType, colors, materials } = filters;
    const colorText = colors.length > 0 ? `paleta de cores: ${colors.map((c: any) => c.label).join(', ')}` : '';
    const materialText = materials.length > 0 ? `materiais: ${materials.map((m: any) => m.label).join(', ')}` : '';
    const fullPrompt = `
        Arte conceitual de um personagem de Kimetsu no Yaiba, estilo "${artStyle.label}".
        - Descrição: ${prompt}
        - Tipo: ${characterType?.label || 'Não especificado'}
        - ${colorText}
        - ${materialText}
    `;
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });

    const imagePart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
        const { data, mimeType } = imagePart.inlineData;
        return { imageUrl: `data:${mimeType};base64,${data}`, prompt: fullPrompt };
    }
    throw new Error("Não foi possível gerar a imagem.");
};

const handleFilmmaker = async (filters: any, ai: GoogleGenAI) => {
    const { prompt, aspectRatio, resolution } = filters;
    const fullPrompt = `
        Você é um diretor de cinema. Descreva em um parágrafo vívido uma cena para Kimetsu no Yaiba.
        - Prompt: ${prompt}
        - Proporção: ${aspectRatio.label}
        - Qualidade: ${resolution.label}
        Foque na cinematografia, ângulos, iluminação, ação e atmosfera.
    `;
    const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: fullPrompt });
    return { description: result.text };
};