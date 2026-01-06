// pages/api/auth/discord/callback.ts
import { Buffer } from 'buffer';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { exchangeCodeForToken, getUserProfile, constructAvatarUrl } from '../../../../lib/discord';
import { isUserWhitelisted } from '../../../../lib/googleSheets';
import type { User } from '../../../../types';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-for-dev-that-is-32-chars-long';
if (SESSION_SECRET.length < 32) {
    console.error('SESSION_SECRET is not set or is too short. It must be at least 32 characters long.');
}

/**
 * Securely seals session data into a signed string.
 * The payload is base64url encoded, and then an HMAC signature is appended.
 * @param data The session data object.
 * @returns A promise that resolves to the sealed session string.
 */
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

        const isWhitelisted = await isUserWhitelisted(discordUser.id);
        if (!isWhitelisted) {
            return res.status(403).redirect('/?error=not_whitelisted');
        }

        const user: User = {
            id: discordUser.id,
            username: discordUser.global_name || discordUser.username,
            avatar: constructAvatarUrl(discordUser.id, discordUser.avatar),
        };

        // Create a session cookie
        const session = await sealData({ user });
        res.setHeader('Set-Cookie', `user-session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`); // 30 days

        // Redirect back to the main page
        res.redirect('/');

    } catch (error: any) {
        console.error('[DISCORD_CALLBACK_ERROR]', error);
        res.status(500).redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
}