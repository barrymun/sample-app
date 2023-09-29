import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, type ReactElement, type ReactNode, useState } from "react";
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
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [providerConfig, setProviderConfig] = useState<any>(undefined);

  useEffect(() => {
    const auth0ProviderConfig = {
      domain: config.auth0Domain,
      clientId: config.auth0ClientId,
      // onRedirectCallback,
      authorizationParams: {
        redirect_uri: window?.location.origin,
        // ...(config.audience ? { audience: config.audience } : null),
      },
    };
    setProviderConfig(auth0ProviderConfig);
  }, []);

  if (!providerConfig) return null;

  return getLayout(
    <Auth0Provider {...providerConfig}>
      <Component {...pageProps} />
    </Auth0Provider>,
  );
}
