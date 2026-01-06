// pages/api/keys/save.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseInitializationError } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (supabaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }
    if (!supabase) {
        return res.status(503).json({ message: 'Serviço de Autenticação não inicializado.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, geminiApiKey, openaiApiKey, deepseekApiKey } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const { error } = await supabase
            .from('user_api_keys')
            .upsert(
                {
                    user_id: userId,
                    gemini_api_key: geminiApiKey,
                    openai_api_key: openaiApiKey,
                    deepseek_api_key: deepseekApiKey,
                    updated_at: new Date(),
                },
                { onConflict: 'user_id' }
            );

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'API keys saved successfully.' });

    } catch (error: any) {
        console.error('Error saving API keys:', error);
        res.status(500).json({ message: 'Failed to save API keys.', details: error.message });
    }
}
