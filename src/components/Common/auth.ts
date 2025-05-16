import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function checkUserAuthorizedWrapper(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
): Promise<void> {
  const { isAuthenticated, getUser } = getKindeServerSession(req, res);
  if (!isAuthenticated() || !(await getUser())) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return handler(req, res);
}
