import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { yellow, brown } from "@mui/material/colors/";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    popup: true;
  }
}

const PRIMARY_COLOR = "#531EDC";
const SECONDARY_COLOR = "#2A2638";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Roboto, monospace",
  },
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: "popup" },
          style: {
            border: `4px solid ${SECONDARY_COLOR}`,
            borderStyle: "dotted",
          },
        },
      ],
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
