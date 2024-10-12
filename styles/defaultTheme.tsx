import { DefaultTheme } from "styled-components";

// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      mainBgColor: string;
      mainBgBlack: string;
      textOnMainBg: string;
      diminishedTextColor: string;
      mainActionColor: string;
      highlightElementColor: string;
    };
    tokens: {
      marginSm: "4px";
      marginM: "8px";
      marginL: "12px";
      marginXl: "16px";
      marginXxl: "24px";
    };
  }
}

// keep this in sync with global.css
export const theme: DefaultTheme = {
  colors: {
    mainBgColor: "#262121",
    mainBgBlack: "#000000",
    textOnMainBg: "#e6e5e5",
    diminishedTextColor: "#b8b8b8",
    mainActionColor: "#1db954",
    highlightElementColor: "rgba(255, 255, 255, 0.2)",
  },
  tokens: {
    marginSm: "4px",
    marginM: "8px",
    marginL: "12px",
    marginXl: "16px",
    marginXxl: "24px",
  },
};
