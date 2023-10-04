import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as jose from "jose";

dotenv.config();

// const allowedOrigins: string[] = ["http://localhost:3000"];
const jwksUri: string = "https://dev-uyysrdqjsakrpapo.eu.auth0.com/.well-known/jwks.json";

const app = express();
const corsOptions = {
  // origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  //   if (!origin) {
  //     return callback(null, true);
  //   }
  //   if (allowedOrigins.indexOf(origin) === -1) {
  //     const msg: string = "The CORS policy for this site does not allow access from the specified Origin.";
  //     return callback(new Error(msg), false);
  //   }
  //   return callback(null, true);
  // },
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // To populate req.cookies
app.use(express.json()); // To parse JSON requests

interface RequestWithJWTPayload extends Request {
  user: {
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    locale: string;
    updated_at: string;
    email: string;
    email_verified: true;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
    sub: string;
    acr: string;
    amr: string[];
    sid: string;
    nonce: string;
  };
}

const jwks = jose.createRemoteJWKSet(new URL(jwksUri));

const verifyAndDecodeToken = async (token: string): Promise<jose.JWTPayload | null> => {
  try {
    const r = await jose.jwtVerify(token, jwks);
    return r.payload;
  } catch (error) {
    return null;
  }
};

const generateAuthToken = (payload: jose.JWTPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth; // Assuming the token is sent as a cookie
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as RequestWithJWTPayload["user"];
    (req as RequestWithJWTPayload).user = verified; // Add user payload to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

app.post("/authenticate", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Access Denied");
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyAndDecodeToken(token);
  if (!payload) {
    return res.status(400).send("Invalid Token");
  }

  const authToken = generateAuthToken(payload);
  res.cookie("auth", authToken, {
    httpOnly: true, // this will prevent the token from being accessed by JavaScript
    // secure: process.env.NODE_ENV === 'production', // this will send the cookie over HTTPS only
    maxAge: 3600000, // this sets the cookie to expire in 1 hour
  });

  res.status(200).send("OK");
});

// This route doesn't need authentication
app.get("/public", (req, res) => {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/private", authenticateRequest, (req, res) => {
  const reqWithUser = req as RequestWithJWTPayload;
  res.json({
    message: `Hello ${reqWithUser.user.name}. You should only see this if you're authenticated.`,
  });
});

app.listen(3001, function () {
  console.log("Listening on http://localhost:3001");
});
