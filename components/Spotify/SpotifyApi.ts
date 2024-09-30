import {
  Album,
  Artist,
  PlaybackStatusResponse,
  PromiseVoidFunction,
  SearchResponse,
  Track,
} from "../types";

export type SpotifyAPi = {
  getPlaybackStatus: () => Promise<PlaybackStatusResponse | undefined>;
  transferPlayback: (deviceId: string) => Promise<void>;
  skipToNext: PromiseVoidFunction;
  skipToPrevious: PromiseVoidFunction;
  playPlayback: (
    params?:
      | {
          context_uri?: string;
          offset?: string | number;
        }
      | undefined
  ) => Promise<void>;
  pausePlayback: PromiseVoidFunction;
  seek: (timeMs: number) => Promise<void>;
  setVolume: (newValue: number) => Promise<void>;
  fetchAlbum: (albumId: string) => Promise<Album>;
  search: (
    query: string,
    types: AllowedSearchTypes[]
  ) => Promise<SearchResponse>;
  fetchArtist: (artistId: string) => Promise<Artist>;
  fetchArtistTopTracks: (artistId: string) => Promise<Track[]>;
  fetchArtistAlbums: (artistId: string) => Promise<Album[]>;
  fetchArtistRelatedArtists: (artistId: string) => Promise<Artist[]>;
};

type StartPlaybackBody = {
  // either context_uri or uris field needs to be passed in

  // album, playlist or artist URI
  context_uri?: string;
  // track URIs to play
  uris?: string[];
  offset?: {
    // one of these need to be provided if offset object is provided
    uri?: string;
    position?: number;
  };
};

export type AllowedSearchTypes =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show"
  | "episode"
  | "audiobook";

type CreateApi = (token: string, deviceId: string) => SpotifyAPi;

export const api: CreateApi = (token: string, deviceId: string) => {
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

    transferPlayback: async (deviceId: string) => {
      const url = "https://api.spotify.com/v1/me/player";
      const body = {
        device_ids: [deviceId],
      };
      fetch(url, { headers, method: "PUT", body: JSON.stringify(body) });
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

    playPlayback: async (
      params:
        | {
            context_uri?: string;
            offset?: string;
          }
        | undefined
    ) => {
      const queryParams = new URLSearchParams({
        device_id: deviceId,
      });
      const url =
        "https://api.spotify.com/v1/me/player/play?" + queryParams.toString();

      let body: StartPlaybackBody | null = null;
      if (params) {
        const { context_uri, offset } = params;

        if (context_uri) {
          body = {
            context_uri: context_uri,
            offset: offset ? { uri: offset } : undefined,
          };
        } else if (offset) {
          body = {
            uris: [offset],
          };
        }
      }

      fetch(url, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
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
    fetchAlbum: async (albumId: string) => {
      const url = `https://api.spotify.com/v1/albums/${albumId}`;
      const result = await fetch(url, {
        method: "GET",
        headers,
      });
      return (await result.json()) as Album;
    },

    search: async (
      searchQuery: string,
      types: AllowedSearchTypes[],
      resultLimit?: number
    ) => {
      const itemTypes = encodeURI(types.join(","));
      const queryParams = new URLSearchParams({
        type: itemTypes,
        q: encodeURI(searchQuery),
        limit: resultLimit?.toString() ?? "10",
      });
      const url = "https://api.spotify.com/v1/search?" + queryParams.toString();
      const result = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-cache",
      });
      return await result.json();
    },

    fetchArtist: async (id: string) => {
      const url = `https://api.spotify.com/v1/artists/${id}`;
      const result = await fetch(url, { method: "GET", headers });
      return await result.json();
    },

    fetchArtistTopTracks: async (id: string) => {
      const url = `https://api.spotify.com/v1/artists/${id}/top-tracks`;
      const result = await fetch(url, { method: "GET", headers });
      return (await result.json()).tracks;
    },

    fetchArtistAlbums: async (id: string) => {
      const url = `https://api.spotify.com/v1/artists/${id}/albums`;
      const result = await fetch(url, { method: "GET", headers });
      return (await result.json()).items;
    },

    fetchArtistRelatedArtists: async (id: string) => {
      const url = `https://api.spotify.com/v1/artists/${id}/related-artists`;
      const result = await fetch(url, { method: "GET", headers });
      return (await result.json()).artists;
    },
  };
};
