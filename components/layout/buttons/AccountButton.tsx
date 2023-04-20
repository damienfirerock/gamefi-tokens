import React from "react";
import { Popover, Typography } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useDispatch } from "react-redux";

import MenuStyledButton from "./common/MenuStyledButton";
import ConnectWalletButtons from "./ConnectWalletButtons";
import PopoverBox from "./common/PopoverBox";
import AccountLink from "./common/AccountLink";

import { truncateString } from "../../../utils/common";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import { setDialogOpen } from "../../../features/AuthSlice";

// FIXME: Need to double try connect with Metamask on Walletconnect ??
// FIXME: Metamask Button does not work if not on ChainId
// TODO: Potential issues in the future as font size between chinese and english text are clearly different

const AccountButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();

  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  const handleLogOut = async () => {
    await signOut();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const isLoggedIn = !!session;

  return (
    <>
      <MenuStyledButton
        variant="contained"
        onClick={isLoggedIn ? handleClick : handleOpenLoginDialog}
      >
        <Typography variant="h6">{session?.user.email ?? "Login"}</Typography>
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
        }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <PopoverBox sx={{ textAlign: "center" }}>
          <Typography variant="h6">
            {!!account && truncateString(account)}
          </Typography>
          {account ? (
            <>
              <AccountLink
                href="/"
                text="Main"
                // icon={<HouseIcon />}
              />

              <AccountLink
                href="/swap"
                text="Swap"
                // icon={<CelebrationIcon />}
              />

              <AccountLink
                href="/marketplace"
                text="Marketplace"
                // icon={<CelebrationIcon />}
              />

              <AccountLink
                href="/account"
                text="Account"
                // icon={<CelebrationIcon />}
              />
              <MenuStyledButton variant="contained" onClick={deactivate}>
                <Typography variant="h6" sx={{ marginLeft: 1 }}>
                  Disconnect
                </Typography>
              </MenuStyledButton>
            </>
          ) : (
            <ConnectWalletButtons />
          )}
          <MenuStyledButton
            variant="contained"
            onClick={isLoggedIn ? handleLogOut : handleOpenLoginDialog}
            disabled={status === "loading"}
          >
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {isLoggedIn ? "Log Out" : "Log In"}
            </Typography>
          </MenuStyledButton>
        </PopoverBox>
      </Popover>
    </>
  );
};

export default AccountButton;
