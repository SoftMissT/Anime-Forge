// pages/api/export.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // This endpoint relied on Firebase which has been removed.
    res.status(501).json({ message: 'O serviço de exportação para Firebase foi desativado.' });
}
