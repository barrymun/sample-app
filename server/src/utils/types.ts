export interface AuthenticatedRequest extends Request {
  user: {
    email: string;
  };
}

export type Environment = "development" | "stage" | "production";

export interface Config {
  jwt: {
    secret: string;
  };
  sendgrid: {
    apiKey: string;
    from: string;
  };
  redis: {
    params: Record<string, unknown>;
  };
}
