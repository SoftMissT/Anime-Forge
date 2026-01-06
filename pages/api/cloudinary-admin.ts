// pages/api/cloudinary-admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import type { User } from '../../types';
import { firestore, firebaseInitializationError } from '../../lib/server/firebaseAdmin';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const getUserFromRequest = (req: NextApiRequest): User | null => {
    try {
        const userHeader = req.headers['x-user'];
        if (userHeader && typeof userHeader === 'string') {
            return JSON.parse(userHeader);
        }
        return null;
    } catch (e) {
        return null;
    }
};

// Function to generate SHA1 signature for Cloudinary API calls
const generateSignature = (paramsToSign: string) => {
    return crypto.createHash('sha1').update(paramsToSign).digest('hex');
};

const handleUsage = async (res: NextApiResponse) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(`timestamp=${timestamp}${API_SECRET}`);
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/usage`;

    const response = await fetch(`${url}?timestamp=${timestamp}&api_key=${API_KEY}&signature=${signature}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Cloudinary Usage API Error: ${error.error.message}`);
    }
    const data = await response.json();
    res.status(200).json({
        used: data.space.usage,
        total: 25 * 1073741824, // 25 GB in bytes for the free plan
    });
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!firestore) {
      throw new Error("Serviço de banco de dados não inicializado para exclusão.");
    }

    const { publicId, creationId } = req.body;
    if (!publicId || !creationId) {
        return res.status(400).json({ message: 'publicId e creationId são obrigatórios.' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`);
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', API_KEY!);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (data.result !== 'ok') {
        throw new Error(`Cloudinary Delete API Error: ${data.result}`);
    }

    // Also remove from Firestore
    await firestore.collection('creations').doc(creationId).update({
        imageUrl: null,
        imagePublicId: null,
        imageBytes: null,
    });

    res.status(200).json({ message: 'Imagem deletada com sucesso.' });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (firebaseInitializationError) {
        return res.status(503).json({ message: `Serviço de Banco de Dados indisponível: ${firebaseInitializationError}` });
    }
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        return res.status(503).json({ message: 'Serviço de Mídia (Cloudinary) não configurado. Verifique as variáveis de ambiente CLOUDINARY_* no servidor.' });
    }
    
    const user = getUserFromRequest(req);
    if (!user || !user.id) {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }

    const { action } = req.query;

    try {
        if (req.method === 'GET' && action === 'usage') {
            await handleUsage(res);
        } else if (req.method === 'POST' && action === 'delete') {
            await handleDelete(req, res);
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ message: `Method ${req.method} ou ação "${action}" não suportados.` });
        }
    } catch (error: any) {
        console.error(`Cloudinary Admin API error for action "${action}":`, error);
        const isAuthError = error.message?.toLowerCase().includes('invalid credentials') || error.message?.toLowerCase().includes('invalid api key');
        const userMessage = isAuthError
            ? 'Credenciais do Cloudinary inválidas. Verifique se CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, e CLOUDINARY_API_SECRET estão corretas no ambiente do servidor.'
            : error.message;
        res.status(500).json({ message: userMessage || 'Ocorreu um erro interno.' });
    }
}
