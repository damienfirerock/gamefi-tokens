import React from "react";
import { Button, ButtonProps } from "@mui/material";

import StyledCircularProgress from "../common/StyledCircularProgress";

interface InteractButtonProps extends ButtonProps {
  text: string;
  method: () => void;
  loading: boolean;
}

const InteractButton: React.FunctionComponent<InteractButtonProps> = (
  props
) => {
  const { text, method, loading, disabled = false, ...rest } = props;
  return (
    <Button
      variant="outlined"
      onClick={method}
      disabled={loading || disabled}
      {...rest}
    >
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

export default InteractButton;
