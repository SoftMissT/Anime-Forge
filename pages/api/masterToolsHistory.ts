// pages/api/masterToolsHistory.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '../../lib/server/turso';
import type { User, MasterToolHistoryItem } from '../../types';

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
  res: NextApiResponse<MasterToolHistoryItem[] | { message: string }>
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
                sql: `SELECT id, createdAt, userInput, aiOutput FROM master_tool_history WHERE userId = ? ORDER BY createdAt DESC`,
                args: [user.id],
            });
            
            const history: MasterToolHistoryItem[] = rs.rows.map(row => ({
                id: row.id as string,
                createdAt: row.createdAt as string,
                userInput: row.userInput as string,
                aiOutput: JSON.parse(row.aiOutput as string),
            }));

            res.status(200).json(history);
        } catch (error: any) {
            console.error("Error fetching Master Tools history from Turso:", error);
            res.status(500).json({ message: `Falha ao buscar histórico do mestre: ${error.message}` });
        }
    } else if (req.method === 'DELETE') {
        try {
            await db.execute({
                sql: 'DELETE FROM master_tool_history WHERE userId = ?',
                args: [user.id]
            });
            res.status(200).json({ message: 'Histórico da Ferramenta do Mestre limpo com sucesso.' });
        } catch (error: any) {
             console.error("Error clearing Master Tools history from Turso:", error);
            res.status(500).json({ message: `Falha ao limpar o histórico do mestre: ${error.message}` });
        }

    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}