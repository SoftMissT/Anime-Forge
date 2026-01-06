// pages/api/export.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore, firebaseInitializationError } from '../../lib/server/firebaseAdmin';
import type { User } from '../../types';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (firebaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Exportação (Firebase) indisponível: ${firebaseInitializationError}` });
    }
    if (!firestore) {
        return res.status(503).json({ message: 'Serviço de Exportação (Firebase) não inicializado.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const user = getUserFromRequest(req);
    if (!user || !user.id) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }

    try {
        const { exportData } = req.body;
        if (!exportData) {
            return res.status(400).json({ message: 'Dados de exportação são obrigatórios.' });
        }

        const exportId = `${user.id}_${Date.now()}`;
        const docRef = firestore.collection('exports').doc(exportId);
        
        await docRef.set({
            userId: user.id,
            createdAt: new Date(),
            data: exportData
        });

        res.status(200).json({ message: 'Dados exportados com sucesso para o Firebase.', exportId });

    } catch (error: any) {
        console.error('Error saving export to Firebase:', error);
        res.status(500).json({ message: 'Falha ao exportar dados para o Firebase.', details: error.message });
    }
}