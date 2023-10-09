import Link from "next/link";

import { LoginButton, LogoutButton } from "app/components";
import { useAuth } from "app/hooks";

export default function Home() {
  const { user } = useAuth();
  // console.log(user, isLoading);

  return (
    <div>
      <ul>
        <li>Hello {user?.email}</li>
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
