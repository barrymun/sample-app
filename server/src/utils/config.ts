import { Config, Environment } from "utils/types";

const environment: Environment = (process.env.NODE_ENV as Environment) || "development";

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || "",
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
    from: process.env.SENDGRID_FROM || "",
  },
  redis: {
    params: environment === "development" ? {} : { url: "redis://redis:6379" },
  },
};

export { environment, config };
