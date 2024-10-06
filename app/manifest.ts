import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "T Music Player",
    short_name: "T Music",
    description: "Music player by TL, powered by Spotify",
    start_url: "/",
    display: "standalone",
    background_color: "#262121",
    theme_color: "#262121",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
