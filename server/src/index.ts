import express from "express";
import cors from "cors";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

const app = express();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://dev-uyysrdqjsakrpapo.eu.auth0.com/api/v2/",
  issuerBaseURL: `https://dev-uyysrdqjsakrpapo.eu.auth0.com/`,
});

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// This route doesn't need authentication
app.get("/api/public", function (req, res) {
  console.log("/api/public");
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
app.get("/api/private", checkJwt, function (req, res) {
  console.log("/api/private");
  res.json({
    message: "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

const checkScopes = requiredScopes("read:messages");

app.get("/api/private-scoped", checkJwt, checkScopes, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
  });
});

app.listen(3001, function () {
  console.log("Listening on http://localhost:3001");
});
