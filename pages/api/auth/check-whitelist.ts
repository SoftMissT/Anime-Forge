// pages/api/auth/check-whitelist.ts
// Esta rota foi desativada. A verificação da whitelist agora ocorre
// diretamente na rota /api/auth/discord/callback.
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(404).json({ message: 'Esta rota foi desativada e substituída.' });
}