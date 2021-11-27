// export const LightTheme = {
//   dark: false,
//   colors: {
//     primary: "rgb(255, 45, 85)",
//     background: "rgb(242, 242, 242)",
//     card: "rgb(255, 255, 255)",
//     text: "rgb(28, 28, 30)",
//     border: "rgb(199, 199, 204)",
//     notification: "rgb(255, 69, 58)",
//   },
// };

import { Theme } from "./types/themeTypes";
import { myColor } from "./apollo/cache";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    selected: myColor(),
    backgroundPrimary: "#222",
    textPrimary: "white",
  },
};
