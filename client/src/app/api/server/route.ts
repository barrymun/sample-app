import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

import { Credentials } from "app/utils/types";

export async function GET() {
  const session = await getSession();
  // console.log(session)

  if (!session) {
    NextResponse.json(null);
    return;
  }

  const auth0TokenResponse = await fetch("https://dev-uyysrdqjsakrpapo.eu.auth0.com/oauth/token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: "https://dev-uyysrdqjsakrpapo.eu.auth0.com/api/v2/",
      grant_type: "client_credentials",
    }),
  });

  const credentials = (await auth0TokenResponse.json()) as Credentials;
  console.log(credentials.access_token);

  try {
    const response = await fetch("http://localhost:3001/api/private", {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    });
    if (response.ok) {
      return NextResponse.json(await response.json());
    } else {
      console.log(await response.text());
      return NextResponse.json(null);
    }
  } catch (err) {
    return NextResponse.json(null);
  }
}
