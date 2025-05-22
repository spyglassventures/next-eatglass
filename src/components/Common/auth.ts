import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { NextApiRequest, NextApiResponse } from "next";
import * as process from "node:process";

export default async function checkUserAuthorizedWrapper(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
): Promise<void> {
  if (
    process.env.NODE_ENV === 'development'
    && process.env.ALLOW_ANON_API_ACCESS === 'true'
  ) return handler(req, res);
  const { isAuthenticated, getUser } = getKindeServerSession(req, res);
  if (!isAuthenticated() || !(await getUser())) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return handler(req, res);
}
