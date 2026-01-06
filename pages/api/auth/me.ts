// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-for-dev-that-is-32-chars-long';

/**
 * Securely unseals and verifies the session data from a signed string.
 * It splits the payload and signature, recalculates the signature, and performs a timing-safe comparison.
 * @param sealedData The signed cookie string.
 * @returns A promise that resolves to the user data object or null if invalid.
 */
async function unsealData(sealedData: string): Promise<any | null> {
    try {
        const [payload, signature] = sealedData.split('.');
        if (!payload || !signature) {
            console.warn("Invalid session format: missing payload or signature.");
            return null;
        }

        const expectedSignature = crypto
            .createHmac('sha256', SESSION_SECRET)
            .update(payload)
            .digest('base64url');

        // Use timingSafeEqual to prevent timing attacks
        const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

        if (!isValid) {
            console.warn("Invalid session signature.");
            return null;
        }

        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch (e) {
        console.error("Failed to unseal session payload:", e);
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
        // Clear the invalid cookie
        res.setHeader('Set-Cookie', `user-session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        res.status(401).json({ message: 'Invalid session' });
    }
}