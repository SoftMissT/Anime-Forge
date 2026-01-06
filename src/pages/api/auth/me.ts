// src/pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-for-dev-that-is-32-chars-long';

async function unsealData(sealedData: string): Promise<any | null> {
    try {
        const [payload, signature] = sealedData.split('.');
        if (!payload || !signature) return null;

        const expectedSignature = crypto
            .createHmac('sha256', SESSION_SECRET)
            .update(payload)
            .digest('base64url');

        const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

        if (!isValid) return null;

        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch (e) {
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sessionCookie = req.cookies['user-session'];

    if (!sessionCookie) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const session = await unsealData(sessionCookie);

    if (session && session.user) {
        res.status(200).json({ user: session.user });
    } else {
        res.setHeader('Set-Cookie', `user-session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        res.status(401).json({ message: 'Invalid session' });
    }
}
