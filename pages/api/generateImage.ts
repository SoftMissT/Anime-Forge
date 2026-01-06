// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Modality } from '@google/genai';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import type { GenerateImageRequest, GeneratedItem } from '../../types';

const getUserGeminiKey = async (userId: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('user_api_keys').select('gemini_api_key').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching gemini key:', error);
        return null;
    }
    return data?.gemini_api_key;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ image?: string, updatedItem?: GeneratedItem } | { message: string; details?: string }>
) {
    if (supabaseInitializationError) {
      return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { prompt, user, sourceImage } = req.body as GenerateImageRequest;

        if (!user || !user.id) return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
        if (!prompt) return res.status(400).json({ message: 'O prompt é obrigatório.' });

        const userApiKey = await getUserGeminiKey(user.id);
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Nenhuma chave de API do Gemini foi configurada no servidor.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const parts: any[] = [];
        if (sourceImage) {
            parts.push({
                inlineData: {
                    mimeType: sourceImage.mimeType,
                    data: sourceImage.data
                }
            });
        }
        parts.push({ text: prompt });

        // Gerar a imagem com Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (!firstPart || !('inlineData' in firstPart) || !firstPart.inlineData?.data) {
             const safetyRatings = response.candidates?.[0]?.safetyRatings;
            if (safetyRatings?.some(r => r.blocked)) throw new Error('A geração da imagem foi bloqueada por motivos de segurança.');
            throw new Error('A resposta da IA não continha uma imagem válida.');
        }

        const generatedImageB64 = firstPart.inlineData.data;

        // Retornar a imagem diretamente. Upload para CDN foi removido.
        res.status(200).json({ image: generatedImageB64 });

    } catch (error: any) {
        console.error("Error in /api/generateImage:", error);
        res.status(500).json({ message: error.message || 'Falha ao processar a imagem.' });
    }
}
