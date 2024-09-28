import styled from "styled-components";
import { SpotifyAPi } from "../Spotify/SpotifyApi";
import { useSuspenseQueries } from "@tanstack/react-query";
import { TracksList } from "../TracksList/TracksList";
import { HorizontalItemContainer } from "../SearchResults/HorizontalItemContainer";
import { PlayPauseButton } from "../Buttons/PlayPauseButton";
import { ClickableTitle } from "../SearchResults/ClickableTitle";
import { StickyHeadingRow } from "./StickyHeadingRow";

type Props = {
  artistId: string;
  spotifyApiRef: SpotifyAPi;
  currentlyPlayingContextUri?: string;
  currentlyPlayingTrackId?: React.ComponentProps<
    typeof TracksList
  >["currentlyPlayingTrackId"];
  isPlaybackPaused: React.ComponentProps<typeof TracksList>["isPlaybackPaused"];
  onPlayPause: React.ComponentProps<typeof TracksList>["onPlayPause"];
  onOpenAlbum: (albumId: string) => void;
  onOpenArtist: (artistId: string) => void;
};

export const Artist = ({
  artistId,
  spotifyApiRef,
  currentlyPlayingContextUri,
  currentlyPlayingTrackId,
  isPlaybackPaused,
  onPlayPause,
  onOpenAlbum,
  onOpenArtist,
}: Props) => {
  const fetchArtist = {
    queryKey: ["artist", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtist(artistId);
      return result;
    },
  };

  const fetchTopTracks = {
    queryKey: ["artist-top-tracks", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtistTopTracks(artistId);
      return result;
    },
  };

  const fetchAlbums = {
    queryKey: ["artist-albums", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtistAlbums(artistId);
      return result;
    },
  };

  const fetchRelatedArtists = {
    queryKey: ["artist-related-artists", artistId],
    queryFn: async () => {
      const result = await spotifyApiRef.fetchArtistRelatedArtists(artistId);
      return result;
    },
  };

  const [artistResult, topTracksResult, albumsResult, relatedArtistsResult] =
    useSuspenseQueries({
      queries: [fetchArtist, fetchTopTracks, fetchAlbums, fetchRelatedArtists],
    });

  const { data: artist } = artistResult;
  const { data: topTracks } = topTracksResult;
  const { data: albums } = albumsResult;
  const { data: relatedArtists } = relatedArtistsResult;

  // take the largest image
  const imgSrc = artist.images[0]?.url ?? "";

  const playTrack = (trackUri: string) => {
    // we should pass in artist.uri as context, but the API doesn't support it :/
    return spotifyApiRef.playPlayback({
      offset: trackUri,
    });
  };

  const onPlayAlbum = (albumUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: albumUri });
  };

  const onPlayArtist = (artistUri: string) => {
    spotifyApiRef.playPlayback({ context_uri: artistUri });
  };

  // todo for the top songs:
  // todo remove the individual play buttons, make the row open the album

  return (
    <>
      <ContentContainer>
        <NameAndImageContainer>
          {imgSrc ? <Img src={imgSrc} /> : null}
          <ArtistName>{artist.name}</ArtistName>
        </NameAndImageContainer>
      </ContentContainer>

      <StickyHeadingRow
        artistName={artist.name}
        onPlay={() => onPlayArtist(artist.uri)}
      />

      <ContentContainer>
        <div>
          <ClickableTitle text="Popular" />
          <TracksList
            displayMode="album"
            isPlaybackPaused={isPlaybackPaused}
            currentlyPlayingTrackId={currentlyPlayingTrackId}
            onPlayPause={onPlayPause}
            playTrack={playTrack}
            tracks={topTracks}
            isTracksListInPlaybackContext={
              currentlyPlayingContextUri === artist.uri
            }
          />
        </div>

        <HorizontalItemContainer
          items={albums.map((album) => {
            return {
              ...album,
              onClick: () => onOpenAlbum(album.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => onPlayAlbum(album.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          variant="square"
          title={{ text: "Discography", onClick: () => {} }}
        />

        <HorizontalItemContainer
          items={relatedArtists.map((artist) => {
            return {
              ...artist,
              onClick: () => onOpenArtist(artist.id),
              PlayButton: () => (
                <PlayPauseButton
                  isPaused={true}
                  onClick={() => onPlayArtist(artist.uri)}
                  colorVariant="mainAction"
                  size="48px"
                />
              ),
            };
          })}
          variant="round"
          title={{ text: "Similar artists", onClick: () => {} }}
        />
      </ContentContainer>
    </>
  );
};

const ContentContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const ArtistName = styled.h1`
  color: ${(props) => props.theme.colors.textOnMainBg};
  font-size: xxx-large;
`;

const NameAndImageContainer = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  animation-timeline: scroll();
  animation-name: fadeout;

  @keyframes fadeout {
    0% {
      opacity: 1;
    }
    60%,
    100% {
      opacity: 0;
    }
  }
`;

const Img = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 100%;
`;
