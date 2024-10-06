import styled from "styled-components";
import { SimplifiedArtist, SimplifiedAlbum } from "./types";

function lastFromArray<Type>(arr: Type[] | undefined): Type | undefined {
  return arr ? arr[arr.length - 1] : undefined;
}

export const CurrentPlaybackInfo = ({
  trackTitle,
  artists,
  album,
  onTrackClick,
  onArtistClick,
}: {
  trackTitle?: string;
  artists?: SimplifiedArtist[];
  album?: SimplifiedAlbum;
  onTrackClick: (albumId: string) => void;
  onArtistClick: (artistId: string) => void;
}) => {
  const imgUrl = lastFromArray(album?.images)?.url;

  return (
    <Container>
      {imgUrl && (
        <img
          src={imgUrl}
          width={64}
          height={64}
          alt={`artwork for album ${album?.name}`}
        />
      )}
      <LinksContainer>
        <ArtistNameButton
          onClick={album ? () => onTrackClick(album?.id) : () => {}}
        >
          {trackTitle}
        </ArtistNameButton>
        <div>
          {artists?.map((artist, index) => {
            const lastItem = index == artists.length - 1;

            return (
              <ArtistLinkButton
                onClick={() => onArtistClick(artist.id)}
                key={artist.id}
              >
                {lastItem ? artist.name : `${artist.name},`}
              </ArtistLinkButton>
            );
          })}
        </div>
      </LinksContainer>
    </Container>
  );
};

// todo this should likely be an <a>, but we should have router to use it properly
const LinkButton = styled.button`
  border: none;
  background: none;
  color: var(--text-on-main-bg);
  cursor: pointer;
  padding: 1px;

  &:hover {
    text-decoration: underline;
  }
`;

const ArtistNameButton = styled(LinkButton)`
  font-weight: bold;
`;

const ArtistLinkButton = styled(LinkButton)`
  color: var(--diminished-text-color);
  display: inline;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LinksContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: start;
`;
