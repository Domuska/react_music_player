export type PromiseVoidFunction = () => Promise<void>;

// todo this is not a spotify track
export type LegacyTrack = {
  name: string;
  uri: string;
  imgUri?: string;
  id: string;
};

type Image = {
  url: string;
  height: number;
  width: number;
};

export type Track = {
  name: string;
  track_number: number;
  id: string;
  is_playable: boolean;
  artists: SimplifiedArtist[];
};

export type SimplifiedArtist = {
  href: string;
  id: string;
  name: string;
  uri: string;
};

export type Album = {
  total_tracks: number;
  href: string;
  images: Image[];
  name: string;
  release_date: string;
  uri: string;
  artists: SimplifiedArtist[];
  id: string;
  tracks: {
    items: Track[];
  };
};

export type SimplifiedAlbum = Pick<
  Album,
  "artists" | "href" | "id" | "images" | "name" | "total_tracks" | "uri"
>;

// export type SimplifiedAlbum = {
//   total_tracks: number;
//   href: string;
//   images: Image[];
//   name: string;
//   release_date: string;
//   uri: string;
//   artists: SimplifiedArtist[];
//   id: string;
// };

// music
export type SpotifyTrackItem = {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  duration_ms: number;
  id: string;
  name: string;
  popularity: number;
  track_number: number;
  uri: string;
  type: "track";
  // todo there's more fields...
};

// podcast
export type SpotifyEpisodeItem = {
  type: "episode";
};

export type SpotifyActions = {
  disallows: {
    resuming: boolean;
    skipping: boolean;
  };
};

export type SpotifyDevice = {
  id: string;
  name: string;
  volume_percent: number;
  supports_volume: string;
};

type GenericPlaybackStatusResponse = {
  actions: SpotifyActions;
  device: SpotifyDevice;
  progress_ms: number;
  is_playing: boolean;
};

type TrackPlaybackStatusResponse = GenericPlaybackStatusResponse & {
  item: SpotifyTrackItem;
  currently_playing_type: "track";
};

type EpisodePlaybackStatusResponse = GenericPlaybackStatusResponse & {
  item: SpotifyEpisodeItem;
  currently_playing_type: "episode";
};

export type PlaybackStatusResponse =
  | TrackPlaybackStatusResponse
  | EpisodePlaybackStatusResponse;
