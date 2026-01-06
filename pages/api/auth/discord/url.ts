// pages/api/auth/discord/url.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
        return res.status(500).json({ message: 'Configuração de autenticação do Discord incompleta no servidor.' });
    }

    const scope = 'identify email'; // Escopos necessários

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope,
    });

    const authorizationUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

    res.status(200).json({ url: authorizationUrl });
}