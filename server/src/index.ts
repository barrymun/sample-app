import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = ["http://localhost:3000"];

const app = express();
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg: string = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // Don't forget to use cookieParser middleware to populate req.cookies
app.use(express.json()); // To parse JSON requests

type User = {
  email: string;
};

interface RequestWithUser extends Request {
  user: User;
}

const createToken = (email: string) => {
  const payload = { email };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  return token;
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // Assuming the token is sent as a cookie
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as User;
    (req as RequestWithUser).user = verified; // Add user payload to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

app.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const token = createToken(email);

  res.cookie("token", token, {
    httpOnly: true, // this will prevent the token from being accessed by JavaScript
    // secure: process.env.NODE_ENV === 'production', // this will send the cookie over HTTPS only
    maxAge: 3600000, // this sets the cookie to expire in 1 hour
  });

  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

// This route doesn't need authentication
app.get("/public", (req, res) => {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/private", authenticateToken, (req, res) => {
  const reqWithUser = req as RequestWithUser;
  res.json({
    message: `Hello ${reqWithUser.user.email}. You should only see this if you're authenticated.`,
  });
});

app.listen(3001, function () {
  console.log("Listening on http://localhost:3001");
});
