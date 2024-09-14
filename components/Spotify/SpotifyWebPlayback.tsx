import React, { useState, useEffect } from "react";

export const SpotifyWebPlayback = ({ token }) => {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
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

      player.setName("Spawtify");

      player.connect();

      return () => {
        player.disconnect();
      };
    };
  }, [token]);

  return (
    <>
      <div className="container">
        <div className="main-wrapper"></div>
      </div>
    </>
  );
};

export default SpotifyWebPlayback;
