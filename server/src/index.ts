import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import crypto from "crypto";
import { type RedisClientType, createClient } from "redis";
import sgMail from "@sendgrid/mail";
import { AuthenticatedRequest } from "utils/types";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

let redisClient: RedisClientType;

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // To populate req.cookies
app.use(express.json()); // To parse JSON requests

const generateRandomHash = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

const generateAuthToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET!);
  return token;
};

const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
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

app.post("/send-email", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  const emailToken: string = generateRandomHash();
  await redisClient.set(emailToken, email);

  const href = `http://localhost:3001/authenticate?emailToken=${emailToken}`;
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL!,
    subject: "Login",
    html: `Click <a href="${href}">here</a> to login`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    res.status(400).send("Unable to send email");
  }
});

app.get("/authenticate", async (req, res) => {
  const emailToken = req.query.emailToken as string;
  if (!emailToken) {
    return res.status(400).send("Email token is required");
  }

  const email = await redisClient.get(emailToken);
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
  await redisClient.del(emailToken);

  res.redirect("http://localhost:3000");
});

app.get("/session", authenticateRequest, async (req, res) => {
  const reqWithUser = req as unknown as AuthenticatedRequest;
  res.json(reqWithUser.user);
});

app.post("/logout", async (req, res) => {
  res.clearCookie("auth");
  res.status(200).send("Logged out");
});

// This route doesn't need authentication
app.get("/public", async (req, res) => {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/private", authenticateRequest, async (req, res) => {
  const reqWithUser = req as unknown as AuthenticatedRequest;
  res.json({
    message: `Hello ${reqWithUser.user.email}. You should only see this if you're authenticated.`,
  });
});

app.listen(3001, async () => {
  // redis
  redisClient = createClient();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();

  console.log("Listening on http://localhost:3001");
});
