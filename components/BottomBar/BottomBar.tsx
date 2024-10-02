import styled from "styled-components";
import { CurrentPlaybackInfo } from "../CurrentPlaybackInfo";
import { SpotifyAPi } from "../Spotify/SpotifyApi";
import { VolumeControls } from "../VolumeBar/VolumeControls";
import { SkipNextButton, SkipPreviousButton } from "../IconButtons/IconButtons";
import { PlayPauseButton } from "../Buttons/PlayPauseButton";
import { ProgressBar } from "../ProgressBar";

type Props = {
  currentSpotifyData?: any;
  onOpenArtist: (artistId: string) => void;
  onOpenAlbum: (albumId: string) => void;
  spotifyOnPlayPauseClick: VoidFunction;
  onSeek: (ms: number) => Promise<void>;
  onVolumeChange: (newLevel: number) => void;
  onMuteClick: VoidFunction;
  spotifyApiRef: SpotifyAPi;
  isMuted: boolean;
};

export const BottomBar = ({
  currentSpotifyData,
  onOpenArtist,
  onOpenAlbum,
  spotifyOnPlayPauseClick,
  onSeek,
  spotifyApiRef,
  onVolumeChange,
  onMuteClick,
  isMuted,
}: Props) => {
  return (
    <>
      <BigScreenContainer>
        <CurrentPlaybackInfo
          album={currentSpotifyData?.item.album}
          trackTitle={currentSpotifyData?.item.name}
          artists={currentSpotifyData?.item.artists}
          onArtistClick={onOpenArtist}
          onTrackClick={onOpenAlbum}
        />

        {/* TODO: the component should handle null values and be disabled rather than this */}
        {spotifyApiRef && (
          <div>
            <ButtonsContainer id="button-container">
              <SkipPreviousButton onClick={spotifyApiRef.skipToPrevious} />

              <PlayPauseButton
                onClick={spotifyOnPlayPauseClick}
                isPaused={!currentSpotifyData?.is_playing}
              />

              <SkipNextButton onClick={spotifyApiRef.skipToNext} />
            </ButtonsContainer>

            <ProgressBar
              currentPlaybackTimeMs={currentSpotifyData?.progress_ms}
              totalPlaybackDurationMs={currentSpotifyData?.item.duration_ms}
              onSeek={onSeek}
            />
          </div>
        )}

        <VolumeControls
          onVolumeChange={onVolumeChange}
          volumePercentage={currentSpotifyData?.device.volume_percent ?? 0}
          onMuteClick={onMuteClick}
          isMuted={isMuted}
        />
      </BigScreenContainer>

      <SmallScreenContainer>
        <PlaybackButtonContainer>
          <CurrentPlaybackInfo
            album={currentSpotifyData?.item.album}
            trackTitle={currentSpotifyData?.item.name}
            artists={currentSpotifyData?.item.artists}
            onArtistClick={onOpenArtist}
            onTrackClick={onOpenAlbum}
          />

          <PlayPauseButton
            onClick={spotifyOnPlayPauseClick}
            isPaused={!currentSpotifyData?.is_playing}
            size="48px"
          />
        </PlaybackButtonContainer>

        <ProgressBar
          currentPlaybackTimeMs={currentSpotifyData?.progress_ms}
          totalPlaybackDurationMs={currentSpotifyData?.item.duration_ms}
          onSeek={() => {}}
          displayTimeLabels={false}
        />
      </SmallScreenContainer>
    </>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const BigScreenContainer = styled.span`
  background-color: var(--main-bg-black);
  padding: 10px 25px 5px 25px;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  display: none;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;

  @media screen and (min-width: 1200px) {
    display: grid;
  }
`;

const SmallScreenContainer = styled.span`
  position: fixed;
  bottom: 0;
  width: 98%;
  left: 1%;
  margin-bottom: 10px;
  border-radius: 10px;

  background-color: rgb(64, 72, 88);

  & img {
    border-radius: 10px 0 0 0;
  }
  @media screen and (min-width: 1200px) {
    display: none;
  }
`;

const PlaybackButtonContainer = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 25px;
`;
