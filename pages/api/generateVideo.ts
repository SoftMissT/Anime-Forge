// FIX: Removed unnecessary triple-slash directive for Next.js types. This is handled automatically by the project's tsconfig.json.
// pages/api/generateVideo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import type { VideoGenerationParams, User } from '../../types';

const getUserGeminiKey = async (userId: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching gemini key:', error);
        return null;
    }
    return data?.gemini_api_key;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ operation: any } | { message: string }>
) {
  if (supabaseInitializationError) {
      return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt, image, config, user } = req.body as VideoGenerationParams;

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }
    if (!prompt) {
        return res.status(400).json({ message: 'O prompt é obrigatório.' });
    }

    const userApiKey = await getUserGeminiKey(user.id);
    const apiKey = userApiKey || process.env.DEV_GEMINI_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Nenhuma chave de API do Gemini foi configurada no servidor.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: image ? { imageBytes: image.data, mimeType: image.mimeType } : undefined,
        config: {
            numberOfVideos: 1,
            resolution: config.resolution,
            aspectRatio: config.aspectRatio,
        }
    });
    
    res.status(200).json({ operation });

  } catch (error: any) {
    console.error("Error in /api/generateVideo:", error);
    res.status(500).json({ message: error.message || 'Falha ao iniciar a geração do vídeo.' });
  }
}