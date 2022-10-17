import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";

interface IMetaMaskButton {
  text: string;
  handleClick: () => void;
}

const MetaMaskButton: React.FunctionComponent<IMetaMaskButton> = (props) => {
  const { handleClick, text } = props;

  return (
    <Button variant="contained" onClick={handleClick}>
      <Image
        src="/metamask-logo-black-and-white.png"
        alt="me"
        width="28"
        height="28"
      />
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default MetaMaskButton;
