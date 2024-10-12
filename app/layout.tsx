import "../styles/global.css";
import { Metadata } from "next";

import { Roboto } from "next/font/google";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "T Music",
  description: "Music player by TL, powered by Spotify",
  keywords: ["Spotify", "Spotify music player", "portfolio"],
  openGraph: {
    title: "T Music",
    description: "Music player by TL, powered by Spotify",
    type: "music.radio_station",
    images: ["images/icon-512.png"],
  },
};

const roboto = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: PropsWithChildren) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}
