import { useUser, type UserProfile } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import React, { ReactElement, useContext, createContext, useMemo, useEffect } from "react";

import { Loading } from "app/components";

type AuthContextProps = {
  user?: UserProfile;
  error?: Error;
  isLoading?: boolean;
};

const AuthContext = createContext<AuthContextProps>({
  isLoading: true,
});

type AuthProviderProps = React.PropsWithChildren<AuthContextProps>;

type UseConfig = () => AuthContextProps;

const AuthProvider = ({ children }: AuthProviderProps): ReactElement<AuthContextProps> => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // we don't want to keep redirecting to login if we're already there
    if (router.pathname === "/login") {
      return;
    }

    if (!isLoading && (error || !user)) {
      router.push("/login");
    }
  }, [user, error, isLoading]);

  const authContextProviderValue = useMemo(() => ({ user, error, isLoading }), [user, error, isLoading]);

  return (
    <AuthContext.Provider value={authContextProviderValue}>{isLoading ? <Loading /> : children}</AuthContext.Provider>
  );
};

const useAuth: UseConfig = () => useContext<AuthContextProps>(AuthContext);

export { AuthProvider, useAuth };
