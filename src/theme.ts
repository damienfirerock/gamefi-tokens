import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { yellow } from "@mui/material/colors/";

const theme = createTheme({
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
