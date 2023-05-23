import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    popup: true;
  }
}

export const PRIMARY_COLOR = "#531EDC";
export const SECONDARY_COLOR = "#8484A933";
export const TERTIARY_COLOR = "#2A2638";

export const DEFAULT_BACKGROUND = "#060111";
export const PAPER_BACKGROUND = "#1A1524";
export const NAV_TEXT_COLOUR = "#8C8A9A";
export const DETAILS_COLOUR = "#0B0320";
export const ALTERNATE_TEXT_COLOR = "#D8D8D8";
const DISABLED_COLOUR = "#979797";

export const WHITE = "#FFFFFF";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Roboto, monospace",
    button: {
      textTransform: "none",
    },
    fontSize: 16,
    body2: { fontWeight: 500 },
  },
  palette: {
    background: { default: DEFAULT_BACKGROUND, paper: PAPER_BACKGROUND },
    primary: {
      main: PRIMARY_COLOR,
      contrastText: WHITE,
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: PRIMARY_COLOR,
    },
    text: {
      primary: WHITE,
      secondary: PRIMARY_COLOR,
    },
    action: {
      disabledBackground: DISABLED_COLOUR,
      disabledOpacity: 0,
      disabled: WHITE,
    },
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: "popup" },
          style: {
            background: WHITE,
            color: NAV_TEXT_COLOUR,
            padding: "1rem",
            borderRadius: "1rem",
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": WHITE,
          "--TextField-brandBorderHoverColor": PRIMARY_COLOR,
          "--TextField-brandBorderFocusedColor": PRIMARY_COLOR,
          "& label.Mui-focused": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
          "& label": {
            color: WHITE,
          },
          "& label.Mui-disabled": {
            color: DISABLED_COLOUR,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "black",
          "&.Mui-disabled": {
            backgroundColor: "#e4e4e4", // works
            // color: "red !important", // FIXME: does not work
          },
          ".MuiInputAdornment-positionEnd": {
            color: "black",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--TextField-brandBorderColor)",
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderHoverColor)",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderFocusedColor)",
          },
          [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: DISABLED_COLOUR,
          },
          [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: DISABLED_COLOUR,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: { borderRadius: "2rem" },
      },
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
