// pages/api/logout.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiResponse } from 'next';
import { sessionOptions } from '../../lib/session';

// FIX: The handler is now an inline async function passed directly to `withIronSessionApiRoute`.
// This allows TypeScript to correctly infer the type of `req` and include the `session` property.
export default withIronSessionApiRoute(async function logoutRoute(req, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ message: 'Logout bem-sucedido.' });
}, sessionOptions);
