// pages/api/creations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '../../lib/server/turso';
import type { User, HistoryItem, GeneratedItem } from '../../types';
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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let db;
    try {
        db = await getTursoClient();
    } catch(e: any) {
        return res.status(503).json({ message: e.message, details: e.message });
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

    // GET: Fetch user's creations or creations with images
    if (req.method === 'GET') {
        try {
            const rs = await db.execute({
                sql: `SELECT id, createdAt, is_favorite, content FROM creations WHERE userId = ? ORDER BY createdAt DESC`,
                args: [user.id],
            });

            const items: HistoryItem[] = rs.rows.map((row: any) => {
                const content = JSON.parse(row.content as string);
                return {
                    id: row.id,
                    createdAt: row.createdAt,
                    is_favorite: Boolean(row.is_favorite),
                    ...content
                } as HistoryItem;
            });
            
            const favorites = items.filter(item => item.is_favorite);
            res.status(200).json({ history: items, favorites });

        } catch (error: any) {
            console.error('Turso GET error:', error);
            res.status(500).json({ message: 'Falha ao buscar criações.', details: error.message });
        }
    } 
    // POST: Update favorite status
    else if (req.method === 'POST') {
        try {
            const { item, is_favorite } = req.body;
            if (!item || !item.id || is_favorite === undefined) {
                return res.status(400).json({ message: 'Item inválido ou status de favorito ausente.' });
            }

            await db.execute({
                sql: 'UPDATE creations SET is_favorite = ? WHERE id = ? AND userId = ?',
                args: [is_favorite, item.id, user.id]
            });

            res.status(200).json({ message: 'Status de favorito atualizado com sucesso.' });
        } catch (error: any) {
            console.error('Turso POST (update favorite) error:', error);
            res.status(500).json({ message: 'Falha ao atualizar favorito.', details: error.message });
        }
    }
    // PUT: Update a creation
    else if (req.method === 'PUT') {
        try {
            const { id, updateData } = req.body;
            if (!id || !updateData) {
                return res.status(400).json({ message: 'ID da criação e dados de atualização são obrigatórios.' });
            }
            
            const { rows } = await db.execute({
                sql: 'SELECT content FROM creations WHERE id = ? AND userId = ?',
                args: [id, user.id]
            });

            if (rows.length === 0) {
                 return res.status(404).json({ message: 'Criação não encontrada ou acesso negado.' });
            }

            const currentContent = JSON.parse(rows[0].content as string);
            const newContent = { ...currentContent, ...updateData };

            await db.execute({
                sql: 'UPDATE creations SET content = ? WHERE id = ?',
                args: [JSON.stringify(newContent), id]
            });

            res.status(200).json({ message: 'Criação atualizada com sucesso.' });
        } catch (error: any) {
            console.error('Turso PUT error:', error);
            res.status(500).json({ message: 'Falha ao atualizar a criação.', details: error.message });
        }
    }
    // DELETE: Delete one or all creations
    else if (req.method === 'DELETE') {
        try {
            const { id, clearAll } = req.query;

            if (clearAll === 'true') {
                await db.execute({
                    sql: 'DELETE FROM creations WHERE userId = ?',
                    args: [user.id]
                });
                res.status(200).json({ message: 'Histórico limpo com sucesso.' });
            } else if (id && typeof id === 'string') {
                await db.execute({
                    sql: 'DELETE FROM creations WHERE id = ? AND userId = ?',
                    args: [id, user.id]
                });
                res.status(200).json({ message: 'Deletado com sucesso.' });
            } else {
                return res.status(400).json({ message: 'ID do item ou parâmetro clearAll=true é necessário.' });
            }
        } catch (error: any) {
            console.error('Turso DELETE error:', error);
            res.status(500).json({ message: 'Falha ao deletar criação.', details: error.message });
        }
    } 
    else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}