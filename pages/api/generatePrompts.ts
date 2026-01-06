// FIX: Removed unnecessary triple-slash directive for Next.js types. This is handled automatically by the project's tsconfig.json.
// pages/api/generatePrompts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// FIX: Added missing import for GoogleGenAI.
import { GoogleGenAI } from '@google/genai';
import { getOpenAiClient } from '../../lib/openai';
import { callDeepSeekAPI } from '../../lib/deepseek';
// FIX: Add missing type imports
import type { MidjourneyParameters, GptParameters, GeminiParameters, PromptGenerationResult, MJParam, User } from '../../types';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';

interface GeneratePromptsRequest {
    basePrompt: string;
    negativePrompt?: string;
    mjParams?: MidjourneyParameters;
    gptParams: GptParameters;
    geminiParams: GeminiParameters;
    generateMidjourney: boolean;
    generateGpt: boolean;
    generateGemini: boolean;
    user: User;
}

interface ApiKeys {
  gemini?: string | null;
  openai?: string | null;
  deepseek?: string | null;
}

// Fetches API keys for a user from Supabase
const getUserApiKeys = async (userId: string): Promise<ApiKeys> => {
    if (!supabase) return {};
    const { data, error } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key, openai_api_key, deepseek_api_key')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Supabase error fetching keys:', error);
        return {};
    }
    
    return {
        gemini: data?.gemini_api_key,
        openai: data?.openai_api_key,
        deepseek: data?.deepseek_api_key,
    };
};

const buildMidjourneyPromptFinal = (base: string, negativePrompt?: string, params?: MidjourneyParameters): string => {
    let prompt = base;
    if (negativePrompt) {
        prompt += ` --no ${negativePrompt}`;
    }
    if (!params) return prompt.trim();
    
    const activeParams = Object.entries(params).filter(([, p]: [string, MJParam<string | number>]) => p.active);
    if (activeParams.length > 0) {
        prompt += ' ';
        activeParams.forEach(([key, param]: [string, MJParam<string | number>]) => {
            const paramKey = key === 'aspectRatio' ? 'ar' : key;
            prompt += `--${paramKey} ${param.value} `;
        });
    }
    return prompt.trim().replace(/\s+/g, ' ');
};

// Funções especialistas para cada plataforma
const generateMidjourneyPrompt = async (concept: string, geminiClient: GoogleGenAI): Promise<string | null> => {
    try {
        console.log("-> Gerando prompt para Midjourney...");
        const systemInstruction = "You are an expert prompt engineer for Midjourney. Your task is to transform the following creative concept into a dense, keyword-rich prompt string, focusing on artistic styles, camera angles (like wide shot, cinematic), lighting (like volumetric lighting, rim lighting), and mood. The output should be a single line of comma-separated keywords and phrases in ENGLISH. Do not use conversational language. Respond ONLY with the prompt string.";
        const response = await geminiClient.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Concept: "${concept}"`,
            config: { systemInstruction, temperature: 0.7 },
        });
        console.log("✅ Prompt para Midjourney gerado.");
        return response.text?.trim() ?? null;
    } catch (e: any) {
        console.warn("⚠️ Falha ao gerar prompt do Midjourney:", e.message);
        return null;
    }
};

const generateGptPrompt = async (concept: string, gptParams: GptParameters, openaiClient: any): Promise<string | null> => {
    try {
        console.log("-> Gerando prompt para DALL-E/GPT...");
        const systemInstruction = `You are a master storyteller and prompt engineer for DALL-E 3. Your task is to take the user's concept and refine it into a rich, descriptive narrative paragraph (3-4 sentences) in ENGLISH. Focus on creating a cinematic scene with details about the setting, character actions, mood, and overall composition reflecting these parameters: Tone: ${gptParams.tone}, Style: ${gptParams.style}, Composition: ${gptParams.composition}. Respond ONLY with the single paragraph of text.`;
        const completion = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: `Concept: "${concept}"` }
            ],
            max_tokens: 350,
            temperature: 0.8,
        });
        console.log("✅ Prompt para DALL-E/GPT gerado.");
        return completion.choices[0].message.content?.trim() || null;
    } catch (e: any) {
        console.warn("⚠️ Falha ao gerar prompt do GPT:", e.message);
        return null;
    }
};

const generateGeminiPrompt = async (concept: string, geminiParams: GeminiParameters, geminiClient: GoogleGenAI): Promise<string | null> => {
    try {
        console.log("-> Gerando prompt para Gemini Image...");
        const systemInstruction = `You are a prompt engineer for Google's advanced image generation models. Your task is to synthesize a user's concept with their desired artistic parameters into a final, powerful prompt in ENGLISH. Naturally weave the following elements into a descriptive paragraph: Art Style: ${geminiParams.artStyle}, Lighting: ${geminiParams.lighting}, Color Palette: ${geminiParams.colorPalette}, Composition: ${geminiParams.composition}, Detail Level: ${geminiParams.detailLevel}. Respond ONLY with the final prompt text.`;
        const response = await geminiClient.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Concept: "${concept}"`,
            config: { systemInstruction, temperature: 0.8 },
        });
        console.log("✅ Prompt para Gemini Image gerado.");
        return response.text?.trim() ?? null;
    } catch (e: any) {
        console.warn("⚠️ Falha ao gerar prompt do Gemini:", e.message);
        return null;
    }
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PromptGenerationResult | { message: string }>
) {
    if (supabaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateMidjourney, generateGpt, generateGemini, user } = req.body as GeneratePromptsRequest;

        if (!user || !user.id) {
            return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
        }

        const apiKeys = await getUserApiKeys(user.id);

        let expandedConcept = basePrompt;

        // Etapa 1: Expansão do conceito inicial com DeepSeek (se a chave existir)
        if (apiKeys.deepseek) {
            try {
                console.log("➡️ Etapa 1: Expandindo ideia com DeepSeek...");
                const deepSeekResponse = await callDeepSeekAPI(
                    [
                        { role: 'system', content: "You are a creative assistant. Take the user's simple idea and expand it into a more vivid and detailed concept (2-3 sentences). Respond with a valid JSON object with a single key: `concept`." },
                        { role: 'user', content: basePrompt }
                    ],
                    apiKeys.deepseek
                );
                if (deepSeekResponse?.concept) {
                    expandedConcept = deepSeekResponse.concept;
                    console.log("✅ Conceito expandido pelo DeepSeek.");
                }
            } catch (e: any) {
                console.warn("⚠️ Falha na chamada ao DeepSeek: ", e.message);
            }
        }

        // Etapa 2: Geração paralela com especialistas
        console.log("➡️ Etapa 2: Gerando prompts especializados em paralelo...");
        
        const promises = [];

        if (generateMidjourney && apiKeys.gemini) {
            const geminiClient = new GoogleGenAI({ apiKey: apiKeys.gemini });
            promises.push(generateMidjourneyPrompt(expandedConcept, geminiClient));
        } else {
            promises.push(Promise.resolve(null));
        }

        if (generateGpt && apiKeys.openai) {
            const openaiClient = getOpenAiClient(apiKeys.openai);
            promises.push(generateGptPrompt(expandedConcept, gptParams, openaiClient));
        } else {
            promises.push(Promise.resolve(null));
        }

        if (generateGemini && apiKeys.gemini) {
            const geminiClient = new GoogleGenAI({ apiKey: apiKeys.gemini });
            promises.push(generateGeminiPrompt(expandedConcept, geminiParams, geminiClient));
        } else {
            promises.push(Promise.resolve(null));
        }

        const [mjResult, gptResult, geminiResult] = await Promise.all(promises);
        
        const result: PromptGenerationResult = {};
        if (mjResult) result.midjourneyPrompt = mjResult;
        if (gptResult) result.gptPrompt = gptResult;
        if (geminiResult) result.geminiPrompt = geminiResult;

        if (Object.keys(result).length === 0) {
             const missingKeys = [
                (generateMidjourney && !apiKeys.gemini) && "Gemini (para Midjourney)",
                (generateGpt && !apiKeys.openai) && "OpenAI",
                (generateGemini && !apiKeys.gemini) && "Gemini (para Gemini)"
            ].filter(Boolean).join(', ');
            throw new Error(`Nenhum prompt pôde ser gerado. Chaves de API ausentes para: ${missingKeys || 'plataformas solicitadas'}.`);
        }

        // Etapa 3: Pós-processamento final (ex: adicionar parâmetros do Midjourney)
        if (result.midjourneyPrompt) {
            result.midjourneyPrompt = buildMidjourneyPromptFinal(result.midjourneyPrompt, negativePrompt, mjParams);
        }

        console.log("✅ Processo de Alquimia concluído.");
        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro em /api/generatePrompts:", error);
        res.status(500).json({ message: error.message || 'Falha ao gerar prompts.' });
    }
}