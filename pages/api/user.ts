// pages/api/user.ts
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiResponse } from 'next';
import { sessionOptions, SessionData } from '../../lib/session';

type ResponseData = SessionData | { isLoggedIn: false };

// FIX: The handler is now an inline async function passed directly to `withIronSessionApiRoute`.
// This allows TypeScript to correctly infer the type of `req` and include the `session` property.
export default withIronSessionApiRoute(async function userRoute(req, res: NextApiResponse<ResponseData>) {
  if (req.session.user && req.session.user.isLoggedIn) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}, sessionOptions);
