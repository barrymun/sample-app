import { useRouter } from "next/router";
import { useEffect } from "react";

import { LoginButton } from "app/components";
import { useAuth } from "app/hooks";

export default function Login() {
  const { user, error, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !error && user) {
      router.push("/");
    }
  }, [user, error, isLoading]);

  return <LoginButton />;
}
