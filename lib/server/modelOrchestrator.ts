// lib/server/modelOrchestrator.ts
import { GoogleGenAI } from '@google/genai';

type ModelProvider = 'gemini' | 'huggingface' | 'togetherai';

const callGemini = async (prompt: string, apiKey: string, model: string): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: model, // "gemini-2.5-pro"
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.85 },
    });
    const responseText = response.text;
    if (!responseText) throw new Error('Gemini retornou uma resposta vazia.');
    return JSON.parse(responseText);
};

const callHuggingFace = async (prompt: string, apiKey: string, model: string): Promise<any> => {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2048, return_full_text: false } }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API falhou com status ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    const generatedText = result[0]?.generated_text || '';
    
    // Tenta encontrar o JSON dentro da string de resposta
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Resposta do Hugging Face não continha um JSON válido.');
    }
    const jsonString = generatedText.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
};

const callTogetherAI = async (prompt: string, apiKey: string, model: string): Promise<any> => {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 4096,
            temperature: 0.8,
        }),
    });
     if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together AI API falhou com status ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    if (!content) throw new Error('Resposta da Together AI não continha conteúdo válido.');
    return JSON.parse(content);
};

const MODELS_CONFIG = {
    "primary": { provider: 'gemini', model: 'gemini-2.5-pro', key: process.env.GEMINI_API_KEY, func: callGemini },
    "creative": { provider: 'huggingface', model: 'mistralai/Mistral-7B-Instruct-v0.2', key: process.env.HUGGING_FACE_API_KEY, func: callHuggingFace },
    // FIX: Swapped to a more efficient and cost-effective model for the 'quick' path.
    "quick": { provider: 'togetherai', model: 'meta-llama/Llama-3.1-8B-Instruct-Turbo', key: process.env.TOGETHER_AI_API_KEY, func: callTogetherAI }
};

const MODEL_PREFERENCE_ORDER: (keyof typeof MODELS_CONFIG)[] = ["primary", "creative", "quick"];

export const generateResponse = async (prompt: string, userGeminiKey?: string): Promise<{ result: any, modelUsed: string }> => {
    for (const modelKey of MODEL_PREFERENCE_ORDER) {
        const config = MODELS_CONFIG[modelKey];
        
        let apiKeyToUse = config.key;
        let providerIdentifier = `${config.provider}:${config.model}`;

        // Prioritize user's key for the primary (Gemini) model
        if (modelKey === 'primary' && userGeminiKey) {
            apiKeyToUse = userGeminiKey;
            providerIdentifier += ' (User Key)';
        }

        if (apiKeyToUse) {
            try {
                console.log(`➡️  Tentando gerar com o modelo: ${providerIdentifier}`);
                const result = await config.func(prompt, apiKeyToUse, config.model);
                console.log(`✅ Sucesso com o modelo: ${providerIdentifier}`);
                return { result, modelUsed: providerIdentifier };
            } catch (error: any) {
                console.warn(`⚠️ Falha com o modelo ${config.provider}: ${error.message}. Tentando o próximo...`);
                // If user key fails, we just continue to the next model in the preference order.
                // This prevents retrying with the server key if the user's key is invalid (e.g. quota exceeded).
                continue;
            }
        } else {
            console.log(`⏭️  Pulando modelo ${config.provider} - Nenhuma chave de API configurada.`);
        }
    }

    throw new Error("Todos os modelos de IA falharam ou não estão configurados. Verifique suas chaves de API na Vercel ou na sua conta de usuário.");
};
