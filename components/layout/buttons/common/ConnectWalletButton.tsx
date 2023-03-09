import React from "react";
import { Button, Typography } from "@mui/material";
import Image from "next/image";

interface IConnectButton {
  text: string;
  src?: string;
  handleClick: () => void;
}

const ConnectButton: React.FunctionComponent<IConnectButton> = (props) => {
  const {
    handleClick,
    text,
    src = "/metamask-logo-black-and-white.png",
  } = props;

  return (
    <Button variant="contained" onClick={handleClick}>
      <Image src={src} alt={src} width="28" height="28" />
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default ConnectButton;
