import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import MetaMaskButton from "./MetaMaskButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";

const NavbarButton: React.FunctionComponent = () => {
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

  if (!account)
    return (
      <MetaMaskButton handleClick={requestConnect} text="Install MetaMask" />
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
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Menu
        </Typography>
      </Button>
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

export default NavbarButton;
