import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";

import useConnectWallet from "../../utils/hooks/useConnectWallet";

const ChangeChainID: React.FunctionComponent = () => {
  const { requestChangeChainId } = useConnectWallet();

  const handleClick = () => {
    requestChangeChainId();
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      <Image
        src="/metamask-logo-black-and-white.png"
        alt="me"
        width="28"
        height="28"
      />
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        Change to Goerli
      </Typography>
    </Button>
  );
};

export default ChangeChainID;
