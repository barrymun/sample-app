import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

import { AuthProvider } from "app/hooks";
import { initialiseApolloClient } from "app/services";

import "assets/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={initialiseApolloClient()}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}
