"use client";
import { createContext, useState } from "react";
import { SpotifyAPi } from "../../components/Spotify/SpotifyApi";
import { PlaybackStatusResponse } from "../../components/types";

export const SpotifyApiContext = createContext<SpotifyAPi | any>({});

// maybe this doesn't need to be here, it could be just provided in player/layout.tsx
export const SpotifyApiContextWrapper = ({ children }) => {
  const [spotifyApiRef, setSpotifyApiRef] = useState<SpotifyAPi | null>(null);
  return (
    <SpotifyApiContext.Provider value={{ setSpotifyApiRef, spotifyApiRef }}>
      {children}
    </SpotifyApiContext.Provider>
  );
};

export const CurrentPlaybackContext =
  createContext<PlaybackStatusResponse | null>(null);
