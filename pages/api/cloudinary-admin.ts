// pages/api/cloudinary-admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).json({ message: 'Cloudinary service removed.' });
}
