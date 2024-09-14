import { NextApiRequest, NextApiResponse } from "next";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;

if (!spotify_client_id) {
  throw new Error("no spotify_client_id found in env vars");
}

const generateRandomString = function (length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// login endpoint that client calls when token doesn't exist,
// reroute the request to Spotify and tell what scopes(claims) we wish to have
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scope =
    "streaming \
    user-read-email \
    user-read-private \
    user-modify-playback-state \
    user-read-playback-state";

  const state = generateRandomString(16);

  if (!spotify_client_id) {
    res.status(500).send(null);
    console.error("no spotify_client_id found in env vars");
    return;
  }

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/api/auth/callback",
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
  res.status(200).json({});
}
