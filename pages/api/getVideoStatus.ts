// FIX: Removed unnecessary triple-slash directive for Next.js types. This is handled automatically by the project's tsconfig.json.
// pages/api/getVideoStatus.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import type { User, VideoOperationStatus } from '../../types';

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
  res: NextApiResponse<VideoOperationStatus | { message: string }>
) {
  if (supabaseInitializationError) {
      return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { operation, user } = req.body as { operation: any; user: User };

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }
    if (!operation) {
        return res.status(400).json({ message: 'Operação é obrigatória.' });
    }
    
    const userApiKey = await getUserGeminiKey(user.id);
    const apiKey = userApiKey || process.env.DEV_GEMINI_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Nenhuma chave de API do Gemini foi configurada no servidor.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });

    if (updatedOperation.done) {
        const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            // The API key must be appended to the download URL
            const finalUrl = `${downloadLink}&key=${apiKey}`;
            res.status(200).json({ done: true, videoUrl: finalUrl, operation: updatedOperation });
        } else {
             res.status(200).json({ done: true, error: 'Operação concluída, mas o link do vídeo não foi encontrado.', operation: updatedOperation });
        }
    } else {
        res.status(200).json({ done: false, operation: updatedOperation });
    }

  } catch (error: any) {
    console.error("Error in /api/getVideoStatus:", error);
    res.status(500).json({ message: error.message || 'Falha ao verificar status do vídeo.' });
  }
}