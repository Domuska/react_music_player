import { useState, useEffect } from "react";
import { ClickableTitle } from "../ClickableTitle";
import styled from "styled-components";

const ONE_SECOND = 1000;

// disabled for now, have to consider if this is any better than using the API
const localPlayerStatusFetchingEnabled = false;

export const SpotifyWebPlayback = ({
  token,
  onPlayerReady,
  onStateUpdate,
}: {
  token: string;
  onPlayerReady: (deviceId: string, sdkInstance: any) => void;
  onStateUpdate: (newState: any) => void;
}) => {
  // todo type this
  const [player, setPlayer] = useState<any>(undefined);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (localPlayerStatusFetchingEnabled) {
      const interval = setInterval(async () => {
        if (player) {
          const ns = await player.getCurrentState();
          onStateUpdate(ns);
        }
      }, ONE_SECOND);

      return () => {
        clearInterval(interval);
      };
    }
  }, [player, onStateUpdate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      // const player = new window.Spotify.Player({
      //   name: "T Music Spotify web SDK instance",
      //   getOAuthToken: (cb) => {
      //     cb(token);
      //   },
      //   volume: 0.5,
      // });

      // setPlayer(player);

      // player.addListener("ready", ({ device_id }) => {
      //   console.log("Ready with Device ID", device_id);
      //   onPlayerReady(device_id, player);
      // });

      // player.addListener("not_ready", ({ device_id }) => {
      //   console.log("Device ID has gone offline", device_id);
      // });

      // player.addListener(
      //   "player_state_changed",
      //   ({ position, duration, track_window: { current_track } }) => {
      //     // todo inform parent playback changed
      //     console.log("Currently Playing", current_track);
      //     console.log("Position in Song", position);
      //     console.log("Duration of Song", duration);
      //   }
      // );

      // player.setName("T Music");

      // player.connect();

      return () => {
        player?.disconnect();
      };
    };
  }, [onPlayerReady, player, token]);

  const onActivate = () => {
    console.log("activate");
    const player = new window.Spotify.Player({
      name: "T Music Spotify web SDK instance",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    setPlayer(player);

    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      onPlayerReady(device_id, player);
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    player.addListener(
      "player_state_changed",
      ({ position, duration, track_window: { current_track } }) => {
        // todo inform parent playback changed
        console.log("Currently Playing", current_track);
        console.log("Position in Song", position);
        console.log("Duration of Song", duration);
      }
    );

    player.addListener("autoplay_failed", () => {
      console.log("Autoplay is not allowed by the browser autoplay rules");
    });

    player.on("initialization_error", ({ message }) => {
      console.error("Failed to initialize", message);
    });

    player.on("authentication_error", ({ message }) => {
      console.error("Failed to authenticate", message);
    });

    player.on("account_error", ({ message }) => {
      console.error("Failed to validate Spotify account", message);
    });

    player.on("playback_error", ({ message }) => {
      console.error("Failed to perform playback", message);
    });

    player.setName("T Music");

    player.connect();
    setActivated(true);
  };

  return (
    <>
      {!activated && (
        <ActivateContainer>
          <ClickableTitle
            text="Click to activate the application"
            onClick={() => onActivate()}
          />
        </ActivateContainer>
      )}
    </>
  );
};

export default SpotifyWebPlayback;

const ActivateContainer = styled.div`
  background-color: ${(props) => props.theme.colors.mainBgBlack};
  display: flex;
  justify-content: center;
  padding: ${(props) => props.theme.tokens.marginXl};
`;

// set interface so TypeScript does not complain about the Spotify custom properties on Window
//stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: VoidFunction;
    // these are Spotify's SDK APIs, no much point in typing it, see
    // https://developer.spotify.com/documentation/web-playback-sdk
    Spotify: any;
  }
}
