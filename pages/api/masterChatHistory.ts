// pages/api/masterChatHistory.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '../../lib/server/turso';
import type { User } from '../../types';

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

const getUserFromRequest = (req: NextApiRequest): User | null => {
    try {
        const userHeader = req.headers['x-user'];
        if (userHeader && typeof userHeader === 'string') {
            return JSON.parse(userHeader);
        }
        return null;
    } catch (e) {
        console.error("Error parsing user from request:", e);
        return null;
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatMessage[] | { message: string }>
) {
    let db;
    try {
        db = await getTursoClient();
    } catch(e: any) {
        return res.status(503).json({ message: e.message });
    }

    const user = getUserFromRequest(req);
    if (!user || !user.id) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }

    if (req.method === 'GET') {
        try {
            const rs = await db.execute({
                sql: 'SELECT history FROM master_chat_history WHERE userId = ?',
                args: [user.id],
            });

            if (rs.rows.length === 0) {
                return res.status(200).json([]);
            }

            const history = JSON.parse(rs.rows[0].history as string);
            res.status(200).json(history);

        } catch (error: any) {
            console.error("Error fetching master chat history:", error);
            res.status(500).json({ message: `Falha ao buscar histórico de chat: ${error.message}` });
        }
    } else if (req.method === 'POST') {
        try {
            const { history } = req.body;
            if (!history || !Array.isArray(history)) {
                return res.status(400).json({ message: 'O histórico de chat (array) é obrigatório.' });
            }

            await db.execute({
                sql: `
                    INSERT INTO master_chat_history (userId, history, updatedAt) 
                    VALUES (?, ?, ?)
                    ON CONFLICT(userId) DO UPDATE SET 
                    history = excluded.history,
                    updatedAt = excluded.updatedAt;
                `,
                args: [user.id, JSON.stringify(history), new Date().toISOString()]
            });

            res.status(200).json({ message: 'Histórico de chat salvo com sucesso.' });

        } catch (error: any) {
            console.error("Error saving master chat history:", error);
            res.status(500).json({ message: `Falha ao salvar o histórico de chat: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}