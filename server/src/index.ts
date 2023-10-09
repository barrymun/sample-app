import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { authenticate, checkAuthenticated, logout, sendEmail, session } from "routes/authentication";
import { privateRoute, publicRoute } from "routes/sample";
import { initialiseRedis } from "utils/redis";
import { initialiseSendgrid } from "utils/sendgrid";

dotenv.config();
initialiseSendgrid();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // populate req.cookies
app.use(express.json()); // parse JSON requests

app.post("/send-email", sendEmail);
app.get("/authenticate", authenticate);
app.get("/session", checkAuthenticated, session);
app.post("/logout", checkAuthenticated, logout);
app.get("/public", publicRoute);
app.get("/private", checkAuthenticated, privateRoute);

app.listen(3001, async () => {
  // redis
  initialiseRedis();

  console.log("Listening on http://localhost:3001");
});
