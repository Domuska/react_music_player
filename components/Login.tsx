import Image from "next/image";
import styled from "styled-components";
import { ArrowRight } from "./IconButtons/Icons";

export const Login = () => {
  return (
    <Container>
      <Header>
        <h1>Hello, music!</h1>
      </Header>

      <A className="btn-spotify" href="/api/player/auth/login">
        Spotify Login
        <ArrowRight />
      </A>

      <InfoContainer>
        <p>
          Glad to see you! This application is still in development, but feel
          free to check it out! 😊
        </p>
        <p>This application is has not been developed by Spotify.</p>
        <PoweredBy>
          <p>Powered by</p>
          <Image
            src="/images/spotify_Full_Logo_Green_RGB.svg"
            width={256}
            height={256}
            alt="Green variant of Spotify's logo"
          />
        </PoweredBy>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5vh;
  color: #000000;
  background-color: #ec88bb;
  background-image: linear-gradient(
    225deg,
    #ec88bb 0%,
    #825aaa 65%,
    #3986bd 100%
  );

  /* enable selection on this login page. Disabled elsewhere. */
  * {
    user-select: auto;
  }
  *::selection {
    background-color: #3986bd;
  }
`;

const A = styled.a`
  margin-bottom: 20vh;
  display: flex;
  gap: 15px;
  flex-direction: row;
  align-items: center;
  font-size: x-large;

  svg {
    width: 48px;
    height: 48px;
    fill: black;
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: translate(15px) scale(1.1);
  }
`;

const InfoContainer = styled.footer`
  display: flex;
  flex-direction: column;
  background-color: #000000;
  /* same as --text-on-main-bg, but this footer should always be themed black */
  color: #e6e5e5;
  padding: 10px 10vw;
  box-shadow: -4px -3px 20px #3986bd;
  width: 100vw;
`;

const PoweredBy = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const Header = styled.header`
  padding: 5vh 10vw;
  font-size: xx-large;
`;
