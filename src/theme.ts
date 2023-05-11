import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { yellow, brown } from "@mui/material/colors/";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    popup: true;
  }
}

const PRIMARY_COLOR = "#531EDC";
const SECONDARY_COLOR = "#2A2638";

const DEFAULT_BACKGROUND = "#060111";
const PAPER_BACKGROUND = "#1A1524";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Roboto, monospace",
  },
  palette: {
    background: { default: DEFAULT_BACKGROUND, paper: PAPER_BACKGROUND },
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
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
