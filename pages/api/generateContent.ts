// pages/api/generateContent.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildPrompt } from '../../lib/promptBuilder';
import { validateGeneratedItem } from '../../lib/generationValidator';
import type { FilterState, User, GeneratedItem, ProvenanceEntry } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { generateResponse } from '../../lib/server/modelOrchestrator';
import { getTursoClient } from '../../lib/server/turso';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
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

interface ApiKeys {
  gemini?: string | null;
  openai?: string | null;
  deepseek?: string | null;
}

const getUserApiKeys = async (userId: string): Promise<ApiKeys> => {
    if (supabaseInitializationError || !supabase) return {};
    const { data, error } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key, openai_api_key, deepseek_api_key')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching keys for content generation:', error);
        return {};
    }
    return {
        gemini: data?.gemini_api_key,
        openai: data?.openai_api_key,
        deepseek: data?.deepseek_api_key,
    };
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GeneratedItem | { message: string, details?: string }>
) {
    let db;
    try {
        db = await getTursoClient();
    } catch(e: any) {
        return res.status(503).json({ message: e.message, details: e.message });
    }
    
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
    
    const { filters, promptModifier } = req.body as {
        filters: FilterState;
        promptModifier: string;
    };
    
    try {
        const userApiKeys = await getUserApiKeys(user.id);
        
        const { result, modelUsed } = await generateResponse(buildPrompt(filters, promptModifier), userApiKeys.gemini || undefined);

        const provenance: ProvenanceEntry[] = [{
            step: 'Geração Principal',
            model: modelUsed,
            status: 'success'
        }];
        
        const validation = validateGeneratedItem(result, filters.category);
        
        const { id: _, ...content } = result;

        const finalItem: GeneratedItem = {
          ...content,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          categoria: filters.category,
          provenance,
          _validation: {
            score: validation.score,
            warnings: validation.warnings,
            attempts: 1, 
            timestamp: new Date().toISOString(),
          }
        };
        
        // Salvar no Turso
        try {
            const { is_favorite, ...dbContent } = finalItem;
            await db.execute({
                sql: 'INSERT INTO creations (id, userId, createdAt, is_favorite, content) VALUES (?, ?, ?, ?, ?)',
                args: [finalItem.id, user.id, finalItem.createdAt, false, JSON.stringify(dbContent)]
            });
        } catch (dbError: any) {
            console.error('Turso error saving creation:', dbError);
            res.setHeader('X-Db-Save-Error', 'true');
        }
        
        res.status(200).json(finalItem);

    } catch (error: any) {
        console.error(`❌ Falha na orquestração da geração: ${error.message}`);
        return res.status(500).json({ message: 'Falha ao gerar conteúdo.', details: error.message });
    }
}