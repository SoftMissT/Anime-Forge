// src/pages/api/auth/discord/callback.ts
import { Buffer } from 'buffer';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { exchangeCodeForToken, getUserProfile, constructAvatarUrl } from '../../../../lib/discord';
import type { User } from '../../../../types';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-for-dev-that-is-32-chars-long';

async function sealData(data: object): Promise<string> {
    const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('base64url');
    return `${payload}.${signature}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { code } = req.query;

    if (typeof code !== 'string') {
        return res.status(400).redirect('/?error=invalid_code');
    }

    try {
        const tokenResponse = await exchangeCodeForToken(code);
        const discordUser = await getUserProfile(tokenResponse.access_token);

        // REMOVED: Whitelist check via Google Sheets. 
        // Access is now open or controlled via Supabase RLS if needed later.

        const user: User = {
            id: discordUser.id,
            username: discordUser.global_name || discordUser.username,
            avatar: constructAvatarUrl(discordUser.id, discordUser.avatar),
        };

        const session = await sealData({ user });
        // Set secure cookie
        res.setHeader('Set-Cookie', `user-session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);

        res.redirect('/');

    } catch (error: any) {
        console.error('[DISCORD_CALLBACK_ERROR]', error);
        res.status(500).redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
}