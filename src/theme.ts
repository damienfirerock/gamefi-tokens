import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { yellow, brown } from "@mui/material/colors/";

const headerFont = {
  fontFamily: "VT323, Roboto, monospace",
  color: brown[600],
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
      main: yellow[900],
    },
    secondary: {
      main: yellow[500],
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
