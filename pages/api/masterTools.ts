// pages/api/masterTools.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type } from '@google/genai';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import type { User, MasterToolResult } from '../../types';
import { getTursoClient } from '../../lib/server/turso';
import { v4 as uuidv4 } from 'uuid';

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

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        xp: {
            type: Type.INTEGER,
            description: 'A quantidade de XP a ser recompensada, entre 50 e 5000.',
        },
        justificativa: {
            type: Type.STRING,
            description: 'Uma explicação concisa do porquê essa quantidade de XP é apropriada para o feito, citando a escala de dificuldade.',
        },
        impacto_narrativo: {
            type: Type.STRING,
            description: 'Como este feito pode impactar a história futura, criando ganchos e consequências diretas (um "Hook de Continuação").',
        },
        recompensas_extras: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: 'Uma lista de 2-3 recompensas adicionais, como itens, títulos, reputação ou informações.',
        },
    },
    required: ['xp', 'justificativa', 'impacto_narrativo', 'recompensas_extras'],
};

const MASTER_TOOLS_SYSTEM_INSTRUCTION = `
Você é um Game Master experiente especializado em balanceamento de RPG de mesa. Sua tarefa é analisar o feito de um jogador e sugerir uma recompensa justa e interessante, seguindo estritamente as diretrizes abaixo. Responda APENAS com um objeto JSON válido que corresponda ao schema fornecido.

Escala de XP:
- Trivial (50-100 XP): Tarefa rotineira, sem risco.
- Fácil (101-300 XP): Desafio menor, risco baixo.
- Moderado (301-800 XP): Desafio padrão, risco médio, exigiu algum planejamento.
- Difícil (801-1500 XP): Desafio significativo, alto risco, solução criativa.
- Heroico (1501-3000 XP): Feito memorável, risco muito alto, mudou o rumo de uma batalha ou arco.
- Épico (3001-5000 XP): Momento definidor da campanha, superou chances impossíveis.

Fatores a considerar na sua análise:
1. Dificuldade técnica da ação.
2. Risco de morte ou fracasso para o jogador ou o grupo.
3. Criatividade e originalidade da solução.
4. Impacto direto na história ou no objetivo da missão.
5. Nível de trabalho em equipe ou sacrifício pelo grupo.
6. Consequências de longo prazo geradas pela ação.
`;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MasterToolResult | { message: string }>
) {
    let db;
    try {
        db = await getTursoClient();
    } catch(e: any) {
        return res.status(503).json({ message: e.message });
    }
    if (supabaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { description, user } = req.body as { description: string; user: User };

        if (!user || !user.id) {
            return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
        }
        if (!description) {
            return res.status(400).json({ message: 'A descrição do feito é obrigatória.' });
        }

        const userApiKey = await getUserGeminiKey(user.id);
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Nenhuma chave de API do Gemini foi configurada.' });
        }
    
        const ai = new GoogleGenAI({ apiKey });
    
        const prompt = `Analise o seguinte feito de um jogador e sugira recompensas, seguindo as diretrizes do sistema. Feito do jogador: "${description}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: MASTER_TOOLS_SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.7,
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error('A IA não retornou uma resposta válida.');
        }
    
        const result = JSON.parse(responseText);

        // Salvar no Turso
        try {
            await db.execute({
                sql: 'INSERT INTO master_tool_history (id, userId, createdAt, userInput, aiOutput) VALUES (?, ?, ?, ?, ?)',
                args: [uuidv4(), user.id, new Date().toISOString(), description, JSON.stringify(result)]
            });
            console.log('Análise da Ferramenta do Mestre salva no Turso.');
        } catch (dbError: any) {
            console.error('Falha ao salvar a análise no Turso:', dbError);
        }

        res.status(200).json(result);

    } catch (error: any) {
        console.error("Error in /api/masterTools:", error);
        res.status(500).json({ message: error.message || 'Falha ao analisar o feito com a IA.' });
    }
}