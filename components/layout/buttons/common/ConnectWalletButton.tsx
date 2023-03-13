import React from "react";
import { Button, Typography } from "@mui/material";
import Image from "next/image";

interface IConnectWalletButton {
  text: string;
  src?: string;
  handleClick: () => void;
}

const ConnectWalletButton: React.FunctionComponent<IConnectWalletButton> = (
  props
) => {
  const {
    handleClick,
    text,
    src = "/metamask-logo-black-and-white.png",
  } = props;

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{ minWidth: 255, justifyContent: "start" }}
    >
      <Image src={src} alt={src} width="28" height="28" />
      <Typography variant="h6" sx={{ marginLeft: 2 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default ConnectWalletButton;
