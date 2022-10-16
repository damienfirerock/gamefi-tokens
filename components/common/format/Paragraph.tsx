import React from "react";
import { Typography, useTheme, TypographyProps } from "@mui/material";

const Paragraph: React.FunctionComponent<TypographyProps> = (props) => {
  const theme = useTheme();
  return (
    <Typography
      variant="body1"
      sx={{
        margin: `${theme.spacing(1.5)} 0`,
      }}
      {...props}
    >
      {props.children}
    </Typography>
  );
};

export default Paragraph;
