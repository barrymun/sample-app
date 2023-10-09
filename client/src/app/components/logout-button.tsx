import { useRouter } from "next/router";

import { useAuth } from "app/hooks";

const LogoutButton = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    const r = await fetch("http://localhost:3001/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    console.log(r.status);
    if (r.status === 200) {
      setUser!(undefined);
      router.push("/login");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export { LogoutButton };
