import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import MetaMaskButton from "./MetaMaskButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  minWidth: 150,
}));

const WalletButton: React.FunctionComponent = () => {
  const {
    provider,
    account,
    chainId,
    requestConnect,
    requestChangeChainId,
    error,
  } = useConnectWallet();

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
    window.open("https://metamask.io/", "_blank");
  };

  if (!account)
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

  if (chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "31337"))
    return (
      <MetaMaskButton
        handleClick={requestChangeChainId}
        text="Change to Goerli"
      />
    );

  return (
    <>
      <StyledButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <Image src="/pokeball.png" alt="me" width="28" height="28" />
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Account
        </Typography>
      </StyledButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        PaperProps={{ sx: { width: 300 } }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </>
  );
};

export default WalletButton;
