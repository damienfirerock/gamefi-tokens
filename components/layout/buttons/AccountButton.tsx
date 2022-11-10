import React from "react";
import { Box, BoxProps, Link, Popover, Typography } from "@mui/material";
import Image from "next/image";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HouseIcon from "@mui/icons-material/House";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StadiumIcon from "@mui/icons-material/Stadium";
import { styled } from "@mui/material/styles";

import MetaMaskButton from "./common/MetaMaskButton";
import PopoverBox from "./common/PopoverBox";
import MenuStyledButton from "./common/MenuStyledButton";
import AccountLink from "./common/AccountLink";

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
        onClick={handleClick}
      >
        <Image src="/pokeball.png" alt="me" width="24" height="24" />
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {truncateString(account)}
        </Typography>
      </MenuStyledButton>
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
        PaperProps={{
          elevation: 0,
          variant: "popup",
          sx: {
            width: 300,
          },
        }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <PopoverBox sx={{ textAlign: "center" }}>
          <StyledBox>
            <Typography variant="h5">
              Account:{" "}
              <Link
                href={`https://goerli.etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {truncateString(account, 8)}
              </Link>
            </Typography>
          </StyledBox>

          <StyledBox>
            <MenuStyledButton
              aria-describedby={id}
              variant="outlined"
              onClick={handleDirectFaucet}
            >
              <OilBarrelIcon />
              <Typography variant="h6" sx={{ marginLeft: 1 }}>
                Free ETH Faucet
              </Typography>
            </MenuStyledButton>
          </StyledBox>

          <AccountLink
            href="/pokemon-center"
            text="Pokemon Center"
            icon={<HouseIcon />}
          />

          <AccountLink
            href="/lucky-draw"
            text="Lucky Draw"
            icon={<CelebrationIcon />}
          />

          <AccountLink
            href="/market-place"
            text="Market Place"
            icon={<ShoppingBasketIcon />}
          />

          <AccountLink href="/arena" text="Arena" icon={<StadiumIcon />} />
        </PopoverBox>
      </Popover>
    </>
  );
};

export default AccountButton;
