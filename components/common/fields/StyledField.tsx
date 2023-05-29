import { TextField, TextFieldProps } from "@mui/material";

import { styled } from "@mui/material/styles";

const ALTERNATE_TEXT_COLOR = "#D8D8D8";

const StyledTextField = styled(TextField)<TextFieldProps>({
  "& label": {
    color: ALTERNATE_TEXT_COLOR,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: ALTERNATE_TEXT_COLOR,
    },
  },
});

export default StyledTextField;
