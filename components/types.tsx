export type PromiseVoidFunction = () => Promise<void>;

// todo this is not a spotify track, this is our own thing
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
  duration_ms: number;
  uri: string;
};

export type SimplifiedArtist = {
  href: string;
  id: string;
  name: string;
  uri: string;
};

export type Artist = {
  followers: {
    total: number;
  };
  genres: string[];
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: "artist";
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

type SearchPaginationFields = {
  limit: number;
  next: string;
  previous: string;
  total: number;
  offset: number;
};

type SimplifiedPlaylist = {
  collaboarative: boolean;
  description: string | null;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    id: string;
    href: string;
    uri: string;
    display_name: string;
    followers: {
      total: number;
    };
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: "playlist";
  uri: string;
};

export type SearchResponse = {
  tracks?: {
    items: SpotifyTrackItem[];
  } & SearchPaginationFields;
  artists?: {
    items: Artist[];
  } & SearchPaginationFields;
  albums?: {
    items: SimplifiedAlbum[];
  } & SearchPaginationFields;
  playlists?: {
    items: SimplifiedPlaylist[];
  } & SearchPaginationFields;
  // todo there's shows, episodes, audiobooks too
};

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
  context: {
    uri: string;
    type: "artist" | "playlist" | "album" | "show";
    href: string;
  };
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
