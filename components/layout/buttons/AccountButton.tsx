import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import { truncateString, handleOpenWindow } from "../../../utils/common";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AccountButton: React.FunctionComponent = () => {
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  const handleDirectFaucet = () => {
    handleOpenWindow("https://goerlifaucet.com/");
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

  // TODO: Update text and check for issues when live
  // This is tailored to Eth network,
  // Need to support Polygon Network
  if (chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "5"))
    return (
      <MetaMaskButton
        handleClick={requestChangeChainId}
        text="Change to Goerli"
      />
    );

  return (
    <>
      <MenuStyledButton
        aria-describedby={id}
        variant="contained"
        disabled={true}
        onClick={handleClick}
      >
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {truncateString(account)}
        </Typography>
      </MenuStyledButton>
    </>
  );
};

export default AccountButton;
