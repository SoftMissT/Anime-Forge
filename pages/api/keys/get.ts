// pages/api/keys/get.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseInitializationError } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (supabaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }
    if (!supabase) {
        return res.status(503).json({ message: 'Serviço de Autenticação não inicializado.' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('user_api_keys')
            .select('gemini_api_key, openai_api_key, deepseek_api_key')
            .eq('user_id', userId)
            .single();

        if (error) {
            // 'PGRST116' is the code for "No rows found"
            if (error.code === 'PGRST116') {
                return res.status(200).json({}); // No keys found, return empty object
            }
            throw error;
        }

        res.status(200).json({
            gemini: data.gemini_api_key,
            openai: data.openai_api_key,
            deepseek: data.deepseek_api_key,
        });

    } catch (error: any) {
        console.error('Error fetching API keys:', error);
        res.status(500).json({ message: 'Failed to fetch API keys.', details: error.message });
    }
}
