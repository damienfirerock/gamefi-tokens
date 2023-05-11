import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    popup: true;
  }
}

const PRIMARY_COLOR = "#531EDC";
const SECONDARY_COLOR = "#2A2638";

const DEFAULT_BACKGROUND = "#060111";
const PAPER_BACKGROUND = "#1A1524";

const DISABLED_COLOUR = "#979797";

const WHITE = "#FFFFFF";

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
      primary: WHITE,
      secondary: WHITE,
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
            border: `4px solid ${SECONDARY_COLOR}`,
            borderStyle: "dotted",
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
          "& label.Mui-disabled": {
            color: DISABLED_COLOUR,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          // color: "black", works
          "&.Mui-disabled": {
            // backgroundColor: "#e4e4e4", // works
            color: "red !important", // does not work
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
