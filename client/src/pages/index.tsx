import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Loading, LoginButton, LogoutButton } from "app/components";

export default function Home() {
  const { user, error, isLoading } = useUser();
  console.log(user, error, isLoading);

  if (isLoading) return <Loading />;

  return (
    <div>
      <ul>
        <li>Hello {user?.name}</li>
        <li>
          <Link href="/">Home</Link>
        </li>
        {user ? (
          <li>
            <LogoutButton />
          </li>
        ) : (
          <li>
            <LoginButton />
          </li>
        )}
      </ul>
    </div>
  );
}
