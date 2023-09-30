import Link from "next/link";

const LogoutButton = () => {
  return <Link href="/api/auth/logout">Logout</Link>;
};

export { LogoutButton };
