import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";

import { AuthProvider } from "app/hooks";
import { initialiseApolloClient } from "app/services";

import "assets/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={initialiseApolloClient()}>
      <UserProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
