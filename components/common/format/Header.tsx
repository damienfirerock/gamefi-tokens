import React from "react";
import { Typography } from "@mui/material/";

const Header: React.FunctionComponent<{ text: string }> = ({ text }) => {
  return (
    <Typography
      variant="h3"
      sx={{
        margin: "20px 0 10px",
      }}
    >
      {text}
    </Typography>
  );
};

export default Header;
