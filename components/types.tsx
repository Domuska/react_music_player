export type PromiseVoidFunction = () => Promise<void>;

export type Track = {
  name: string;
  uri: string;
  imgUri?: string;
  id: string;
};

export type SpotifyItem = {
  album: any;
  artists: any[];
  duration_ms: number;
  id: string;
  name: string;
  popularity: number;
  track_number: number;
  uri: string;
  // todo there's more fields...
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

export type PlaybackStatusResponse = {
  item: SpotifyItem;
  actions: SpotifyActions;
  device: SpotifyDevice;
  progress_ms: number;
  is_playing: boolean;
};
