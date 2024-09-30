import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;

export const ACCESS_TOKEN_COOKIE_NAME = "domuska_spawtify_access_token";

// Callback function that Spotify will call after user has logged in on their end
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/api/player/auth/callback",
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

  // redeem the code with our secrets to get the access_code
  const response = await fetch(authOptions.url, {
    method: "post",
    body: new URLSearchParams(authOptions.form),
    headers: authOptions.headers,
  });
  const asJson = await response.json();

  const access_token = asJson.access_token;
  if (!access_token) {
    res.status(500).send("failed to fetch access token");
    return;
  }

  // save the access_token on client-side
  // todo add Next's RPC server functions to call spotify API,
  // set path and HTTP only to the cookie then
  // not using HTTP only is pretty unsecure.
  // using sameSite should be done as well
  // https://curity.medium.com/best-practices-for-storing-access-tokens-in-the-browser-6b3d515d9814
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
  res.setHeader(
    "Set-Cookie",
    serialize(ACCESS_TOKEN_COOKIE_NAME, access_token, {
      path: "/",
      maxAge: asJson.expires_in,
      secure: true,
    })
  );
  res.redirect("/");
  return;
}
