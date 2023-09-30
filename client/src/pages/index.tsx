import Link from "next/link";

import { LoginButton, LogoutButton } from "app/components";
import { useAuth } from "app/hooks";

export default function Home() {
  const { user, error, isLoading } = useAuth();
  console.log(user, error, isLoading);

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
