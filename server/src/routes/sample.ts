import type { Request, Response } from "express";

import { AuthenticatedRequest } from "utils/types";

/**
 * this route doesn't need authentication
 */
const publicRoute = async (req: Request, res: Response) => {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
};

/**
 * this route needs authentication
 */
const privateRoute = async (req: Request, res: Response) => {
  const reqWithUser = req as unknown as AuthenticatedRequest;
  res.json({
    message: `Hello ${reqWithUser.user.email}. You should only see this if you're authenticated.`,
  });
};

export { publicRoute, privateRoute };
