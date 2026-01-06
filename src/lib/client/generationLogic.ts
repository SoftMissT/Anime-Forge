import { buildPrompt } from '../promptBuilder';
import { getAiClient } from '../gemini';
import { getOpenAiClient } from '../openai';
import { callDeepSeekAPI } from '../deepseek';
import type { FilterState, GeneratedItem } from '../../types';
import { generateStableItem } from '../generationValidator';

export interface ApiKeys {
    gemini?: string;
    openai?: string;
    deepseek?: string;
}

export const generateContentClient = async (
    filters: FilterState,
    promptModifier: string,
    keys: ApiKeys
): Promise<GeneratedItem> => {
    
    // Define the core generation function that will be retried if validation fails
    const generationTask = async (): Promise<any> => {
        const prompt = buildPrompt(filters, promptModifier);
        let rawJson: any = null;
        let modelUsed = '';

        let errors: Error[] = [];

        // 1. Gemini
        if (!rawJson && keys.gemini) {
            try {
                const ai = getAiClient(keys.gemini);
                if (ai) {
                    // Cast to any to avoid TS error if package version mismatch
                    const model = (ai as any).getGenerativeModel({ model: 'gemini-1.5-flash' }); 
                    const result = await model.generateContent(prompt);
                    const text = result.response.text();
                    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/s);
                    const jsonStr = (jsonMatch && (jsonMatch[1] || jsonMatch[2])) || text;
                    rawJson = JSON.parse(jsonStr);
                    modelUsed = 'gemini';
                }
            } catch (e: any) {
                console.warn('Gemini generation failed:', e);
                errors.push(e);
            }
        }

        // 2. DeepSeek
        if (!rawJson && keys.deepseek) {
             try {
                rawJson = await callDeepSeekAPI([{ role: 'user', content: prompt }], keys.deepseek);
                modelUsed = 'deepseek';
             } catch (e: any) {
                 console.warn('DeepSeek generation failed:', e);
                 errors.push(e);
             }
        }
        
        // 3. OpenAI
        if (!rawJson && keys.openai) {
            try {
                 const openai = getOpenAiClient(keys.openai);
                 if (openai) {
                     const completion = await openai.chat.completions.create({
                         model: "gpt-3.5-turbo", 
                         messages: [{ role: "user", content: prompt }],
                         response_format: { type: "json_object" }
                     });
                     const content = completion.choices[0].message.content;
                     if (content) {
                        rawJson = JSON.parse(content);
                        modelUsed = 'openai';
                     }
                 }
            } catch (e: any) {
                 console.warn('OpenAI generation failed:', e);
                 errors.push(e);
            }
        }

        if (!rawJson) {
            const errorMsg = errors.map(e => e.message).join(' | ');
            throw new Error(`Falha na geração: Nenhum modelo disponível ou todos falharam. Verifique suas chaves. Erros: ${errorMsg || 'Chaves ausentes/inválidas'}`);
        }

        return {
            ...rawJson,
            _provenanceModel: modelUsed
        };
    };

    const validatedItem = await generateStableItem(filters, generationTask);

    return {
        ...validatedItem,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        categoria: filters.category,
        provenance: [{ 
            step: 'generation', 
            model: (validatedItem as any)._provenanceModel || 'unknown', 
            status: 'success' 
        }]
    };
};
