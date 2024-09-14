import { PlaybackStatusResponse, PromiseVoidFunction } from "../types";

export type SpotifyAPi = {
  getPlaybackStatus: () => Promise<PlaybackStatusResponse | undefined>;
  skipToNext: PromiseVoidFunction;
  skipToPrevious: PromiseVoidFunction;
  playPlayback: PromiseVoidFunction;
  pausePlayback: PromiseVoidFunction;
  seek: (timeMs: number) => Promise<void>;
  setVolume: (newValue: number) => Promise<void>;
};

export const api: (token: string) => SpotifyAPi = (token: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return {
    getPlaybackStatus: async () => {
      const url = "https://api.spotify.com/v1/me/player";
      const result = await fetch(url, { headers });

      // if no playback is going on
      if (result.status == 204) {
        return;
      }

      // todo if 401 -> reauth

      return (await result.json()) as PlaybackStatusResponse;
    },

    skipToNext: async () => {
      const url = "https://api.spotify.com/v1/me/player/next";
      fetch(url, {
        method: "POST",
        headers,
      });
    },

    skipToPrevious: async () => {
      const url = "https://api.spotify.com/v1/me/player/previous";
      fetch(url, { method: "POST", headers });
    },

    playPlayback: async () => {
      const url = "https://api.spotify.com/v1/me/player/play";
      fetch(url, {
        method: "PUT",
        headers,
      });
    },
    pausePlayback: async () => {
      const url = "https://api.spotify.com/v1/me/player/pause";
      fetch(url, {
        method: "PUT",
        headers,
      });
    },
    seek: async (timeMs: number) => {
      const queryParams = new URLSearchParams({
        position_ms: timeMs.toString(),
      });
      const url =
        "https://api.spotify.com/v1/me/player/seek?" + queryParams.toString();
      fetch(url, {
        method: "PUT",
        headers,
      });
    },
    setVolume: async (newValue: number) => {
      const queryParams = new URLSearchParams({
        volume_percent: newValue.toString(),
      });
      const url =
        "https://api.spotify.com/v1/me/player/volume?" + queryParams.toString();
      fetch(url, {
        method: "PUT",
        headers,
      });
    },
  };
};
