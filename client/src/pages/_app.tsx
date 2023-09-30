import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";

import { AuthProvider } from "app/hooks/use-auth";

import "assets/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </UserProvider>
  );
}
