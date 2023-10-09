import { useRouter } from "next/router";
import { useEffect } from "react";

import { LoginButton } from "app/components";
import { useAuth } from "app/hooks";

export default function Login() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading]);

  return <LoginButton />;
}
