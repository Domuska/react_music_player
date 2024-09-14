import styled from "styled-components";
import { SimplifiedArtist } from "./types";

export const CurrentPlaybackInfo = ({
  imgUrl,
  trackTitle,
  artists,
  onTrackClick,
  onArtistClick,
}: {
  imgUrl?: string;
  trackTitle?: string;
  artists?: SimplifiedArtist[];
  onTrackClick: VoidFunction;
  onArtistClick: (artist: SimplifiedArtist) => void;
}) => {
  return (
    <Container>
      <img src={imgUrl} width={64} height={64} />
      <LinksContainer>
        <ArtistNameButton onClick={onTrackClick}>{trackTitle}</ArtistNameButton>
        <div>
          {artists?.map((artist, index) => {
            const lastItem = index == artists.length - 1;

            return (
              <ArtistLinkButton
                onClick={() => onArtistClick(artist)}
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
