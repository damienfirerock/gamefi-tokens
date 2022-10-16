import React from "react";
import { Typography, TypographyProps } from "@mui/material/";

interface IHeader extends TypographyProps {
  text: string;
}

const Header: React.FunctionComponent<IHeader> = ({ text, variant = "h3" }) => {
  return (
    <Typography
      variant={variant}
      sx={{
        margin: "20px 0 10px",
      }}
    >
      {text}
    </Typography>
  );
};

export default Header;
