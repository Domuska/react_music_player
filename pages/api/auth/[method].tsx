import { NextApiRequest, NextApiResponse } from "next";

const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;

// todo should this token be saved somewhere at all?
let access_token: string | undefined = undefined;

// todo once above token is saved somewhere else,
// separate these two endpoints from each other.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req.query;
  if (method === "token") {
    res.json({
      access_token: access_token,
    });
    return;
  }

  // todo type this somehow
  const code = req.query.code as string;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/api/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  const response = await fetch(authOptions.url, {
    method: "post",
    body: new URLSearchParams({
      code: code,
      redirect_uri: "http://localhost:3000/api/auth/callback",
      grant_type: "authorization_code",
    }),
    headers: authOptions.headers,
  });
  const asJson = await response.json();

  console.log("as json", asJson);

  access_token = asJson.access_token;
  res.redirect("/");
}
