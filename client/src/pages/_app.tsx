import { Auth0Provider } from "@auth0/auth0-react";
import { type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { config } from "config";

import "assets/globals.css";

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const providerConfig = {
    domain: config.auth0Domain,
    clientId: config.auth0ClientId,
    // onRedirectCallback,
    authorizationParams: {
      // redirect_uri: window.location.origin,
      redirect_uri: "http://localhost:3000/",
      // ...(config.audience ? { audience: config.audience } : null),
    },
  };

  return (
    <Auth0Provider {...providerConfig}>
      <Component {...pageProps} />
    </Auth0Provider>
  );
}
