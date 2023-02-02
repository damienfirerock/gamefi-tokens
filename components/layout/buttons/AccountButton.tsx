import React from "react";
import { Typography } from "@mui/material";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import { truncateString, handleOpenWindow } from "../../../utils/common";
import CONFIG from "../../../config";

const nextNetwork = () => {
  switch (CONFIG.NETWORK_CHAIN_ID) {
    case "80001":
      return "Mumbai Testnet";
    case "137":
      return "Polygon";
    default:
      return "Network";
  }
};

const AccountButton: React.FunctionComponent = () => {
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  if (!provider)
    return (
      <MetaMaskButton
        handleClick={handleInstallMetamask}
        text="Install MetaMask"
      />
    );

  if (!account)
    return (
      <MetaMaskButton handleClick={requestConnect} text="Connect MetaMask" />
    );

  if (chainId !== parseInt(CONFIG.NETWORK_CHAIN_ID || "80001"))
    return (
      <MetaMaskButton
        handleClick={requestChangeChainId}
        text={`Change to ${nextNetwork()}`}
      />
    );

  return (
    <MenuStyledButton variant="contained" disabled={true}>
      <Typography variant="h6" sx={{ marginLeft: 1 }}>
        {truncateString(account)}
      </Typography>
    </MenuStyledButton>
  );
};

export default AccountButton;
