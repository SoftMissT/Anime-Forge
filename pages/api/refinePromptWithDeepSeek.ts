// pages/api/refinePromptWithDeepSeek.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { callDeepSeekAPI, DeepSeekMessage } from '../../lib/deepseek';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import type { User } from '../../types';
import { Buffer } from 'buffer';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-for-dev-that-is-32-chars-long';

async function unsealData(sealedData: string): Promise<{ user: User } | null> {
    try {
        const [payload, signature] = sealedData.split('.');
        if (!payload || !signature) return null;
        const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch (e) {
        return null;
    }
}

interface RefineRequest {
    prompt: string;
}

interface RefineResponse {
    refinedPrompt?: string;
    message?: string;
}

const getUserDeepSeekKey = async (userId: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('user_api_keys')
        .select('deepseek_api_key')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching deepseek key:', error);
        return null;
    }
    return data?.deepseek_api_key;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RefineResponse>
) {
    if (supabaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    const sessionCookie = req.cookies['user-session'];
    if (!sessionCookie) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }
    const session = await unsealData(sessionCookie);
    const user = session?.user;

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
    }

    const { prompt } = req.body as RefineRequest;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt é obrigatório.' });
    }

    try {
        const userApiKey = await getUserDeepSeekKey(user.id);

        if (!userApiKey) {
            return res.status(400).json({ message: 'Nenhuma chave de API da DeepSeek foi encontrada para este usuário.' });
        }

        const messages: DeepSeekMessage[] = [
            {
                role: 'system',
                content: "You are an expert prompt engineer for image generation AIs like Midjourney and DALL-E. Your task is to refine a user's basic prompt into a more detailed, artistic, and effective one. You must respond with a valid JSON object containing a single key: `refinedPrompt`. The value should be the refined prompt as a string in ENGLISH."
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        const responseJson = await callDeepSeekAPI(messages, userApiKey);

        if (!responseJson || typeof responseJson.refinedPrompt !== 'string') {
            // Check if it's the raw text response
            if (typeof responseJson === 'string') {
                 return res.status(200).json({ refinedPrompt: responseJson });
            }
            throw new Error('A resposta do DeepSeek não estava no formato JSON esperado.');
        }

        res.status(200).json({ refinedPrompt: responseJson.refinedPrompt });

    } catch (error: any) {
        console.error('DeepSeek refinement error:', error);
        res.status(500).json({ message: error.message || 'Falha ao refinar o prompt com DeepSeek.' });
    }
}