import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

interface IConnectWalletButton {
  text: string;
  supplementaryText?: string;
  src?: string;
  additionalStyles?: Record<
    string,
    string | number | Record<string, string | number>
  >;
  handleClick: () => void;
}

const ConnectWalletButton: React.FunctionComponent<IConnectWalletButton> = (
  props
) => {
  const {
    handleClick,
    text,
    src = "/metamask-logo-black-and-white.png",
    supplementaryText,
    additionalStyles,
  } = props;

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      sx={{
        width: "48%",
        height: 162,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingLeft: "1.75rem",
        ...additionalStyles,
      }}
    >
      <Image src={src} alt={src} width="28" height="28" />
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="body2">{text}</Typography>
        {supplementaryText && (
          <Typography variant="caption">{supplementaryText}</Typography>
        )}
      </Box>
    </Button>
  );
};

export default ConnectWalletButton;
