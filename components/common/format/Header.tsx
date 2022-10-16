import React from "react";
import { Typography, TypographyProps } from "@mui/material/";

interface IHeader extends TypographyProps {
  text: string;
}

const Header: React.FunctionComponent<IHeader> = ({
  text,
  variant = "h3",
  ...props
}) => {
  return (
    <Typography variant={variant} {...props}>
      {text}
    </Typography>
  );
};

export default Header;
