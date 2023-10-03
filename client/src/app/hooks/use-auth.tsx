// import { useLazyQuery } from "@apollo/client/react";
import { useUser, type UserProfile } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import React, { ReactElement, useContext, createContext, useMemo, useEffect, useCallback } from "react";

import { Loading } from "app/components";
// import { GET_USER_BY_EMAIL } from "app/graphql/users";
// import { Users } from "codegen/codegen";

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

  // const [getUserByEmail] = useLazyQuery<Users>(GET_USER_BY_EMAIL);

  const getUser = useCallback(
    async () => {
      if (!user) return;

      const r = await fetch("http://localhost:3000/api/token");
      const { token } = await r.json();
      // console.log(token);

      // await fetch("http://localhost:3001/authenticate", {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     email: user.email,
      //   }),
      // });

      await fetch("http://localhost:3001/private", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      // const res = await getUserByEmail({ variables: { email: user.email } });
      // console.log(res.data?.email);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  useEffect(() => {
    // we don't want to keep redirecting to login if we're already there
    if (router.pathname === "/login") {
      return;
    }

    if (!isLoading && (error || !user)) {
      router.push("/login");
    }

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error, isLoading]);

  const authContextProviderValue = useMemo(() => ({ user, error, isLoading }), [user, error, isLoading]);

  return (
    <AuthContext.Provider value={authContextProviderValue}>{isLoading ? <Loading /> : children}</AuthContext.Provider>
  );
};

const useAuth: UseConfig = () => useContext<AuthContextProps>(AuthContext);

export { AuthProvider, useAuth };
