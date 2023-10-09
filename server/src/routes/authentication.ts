import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getVal, removeVal, setVal } from "utils/redis";
import { sendMail } from "utils/sendgrid";
import { AuthenticatedRequest } from "utils/types";

const generateRandomHash = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

const generateAuthToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET!);
  return token;
};

const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth; // Assuming the token is sent as a cookie
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedRequest["user"];
    (req as unknown as AuthenticatedRequest).user = verified; // Add user payload to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const sendEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  const emailToken: string = generateRandomHash();
  await setVal(emailToken, email);

  const href = `http://localhost:3001/authenticate?emailToken=${emailToken}`;
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL!,
    subject: "Login",
    html: `Click <a href="${href}">here</a> to login`,
  };

  const wasSent = await sendMail(msg);
  if (!wasSent) {
    return res.status(400).send("Unable to send email");
  }
  return res.status(200).send("Email sent");
};

const authenticate = async (req: Request, res: Response) => {
  const emailToken = req.query.emailToken as string;
  if (!emailToken) {
    return res.status(400).send("Email token is required");
  }

  const email = await getVal(emailToken);
  if (!email) {
    return res.status(400).send("Email token is invalid");
  }

  const authToken = generateAuthToken(email);
  res.cookie("auth", authToken, {
    httpOnly: true, // this will prevent the token from being accessed by JavaScript
    secure: process.env.NODE_ENV === "production", // this will send the cookie over HTTPS only
    sameSite: "lax",
  });

  // prevent replay attacks
  await removeVal(emailToken);

  // take the user to the client
  res.redirect("http://localhost:3000");
};

const session = async (req: Request, res: Response) => {
  const reqWithUser = req as unknown as AuthenticatedRequest;
  res.json(reqWithUser.user);
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("auth");
  res.status(200).send("Logged out");
};

export { checkAuthenticated, sendEmail, authenticate, session, logout };
