import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log({ user, isAuthenticated, isLoading });
  return <p>hello world</p>;
}

export { Home };
