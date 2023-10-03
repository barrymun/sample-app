import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  // console.log(token.accessToken);
  return NextResponse.json({ token: session?.idToken });
}
