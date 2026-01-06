// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Clear the session cookie by setting its expiration date to the past
    res.setHeader('Set-Cookie', `user-session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.status(200).json({ message: 'Logged out' });
}