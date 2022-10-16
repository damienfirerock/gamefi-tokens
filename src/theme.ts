import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { yellow } from "@mui/material/colors/";

const headerFont = {
  fontFamily: "VT323, Roboto, monospace",
};

const theme = createTheme({
  typography: {
    h1: headerFont,
    h2: headerFont,
    h3: headerFont,
    h4: headerFont,
    h5: headerFont,
    h6: headerFont,
  },
  palette: {
    primary: {
      main: yellow[800],
    },
    secondary: {
      main: yellow[50],
    },
  },
});

export default responsiveFontSizes(theme);

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      primary: {
        main: string;
      };
      secondary: {
        main: string;
      };
    };
  }
}
