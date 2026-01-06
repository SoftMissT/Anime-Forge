// src/pages/api/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../../lib/supabaseClient';
// FIX: Use alias import for constants
import { CONFLICT_SCALES } from '@/constants';

const extractFirstJson = (str: string): string | null => {
    let firstOpen = str.indexOf('{');
    if (firstOpen === -1) firstOpen = str.indexOf('[');
    if (firstOpen === -1) return null;
    let balance = 0;
    for (let i = firstOpen; i < str.length; i++) {
        if (str[i] === '{' || str[i] === '[') balance++;
        else if (str[i] === '}' || str[i] === ']') balance--;
        if (balance === 0) return str.substring(firstOpen, i + 1);
    }
    return null;
};

function safeJsonParse(jsonString: string): any {
    let parsableString = jsonString.trim();
    const markdownMatch = /```(?:json)?\s*([\s\S]*?)\s*```/.exec(parsableString);
    if (markdownMatch && markdownMatch[1]) {
        parsableString = markdownMatch[1].trim();
    } else {
        const extractedJson = extractFirstJson(parsableString);
        if (extractedJson) parsableString = extractedJson;
    }
    try { return JSON.parse(parsableString); } catch (e) { throw new Error("A resposta da IA não estava em um formato JSON válido."); }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autorização ausente.' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ message: 'Token de sessão inválido ou expirado.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "Chave de API da IA não configurada." });

    try {
        const ai = new GoogleGenAI({ apiKey });
        const { view, filters } = req.body;
        
        // Simulação básica da lógica.
        const prompt = `Gere um conteúdo JSON para a view ${view} com filtros: ${JSON.stringify(filters)}. Responda apenas com JSON.`;
        
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.status(200).json(safeJsonParse(result.text || '{}'));
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}