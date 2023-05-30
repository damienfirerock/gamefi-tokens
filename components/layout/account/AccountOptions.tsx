import React from "react";
import { Button } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useDispatch } from "react-redux";

import ConnectWalletButtons from "../buttons/ConnectWalletButtons";
import GameAccountDetails from "./GameAccountDetails";
import WalletDetails from "./WalletDetails";

import { AppDispatch } from "../../../store";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import {
  setDialogOpen,
  setAccountDetailsOpen,
} from "../../../features/AuthSlice";

// FIXME: Need to double try connect with Metamask on Walletconnect ??
// FIXME: Metamask Button does not work if not on ChainId
// TODO: Potential issues in the future as font size between chinese and english text are clearly different

const AccountOptions: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();

  const { data: session, status } = useSession();

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  const handleLogOut = () => {
    dispatch(setAccountDetailsOpen(null));
    signOut({ redirect: false });
    // Alternatively, can use 'signout' page redirects
    // if the lag in terms of closing account details is an issue
  };

  const isLoggedIn = !!session;

  return (
    <>
      <GameAccountDetails />
      <Button
        variant="contained"
        onClick={isLoggedIn ? handleLogOut : handleOpenLoginDialog}
        disabled={status === "loading"}
        sx={{ marginY: "0.25rem" }}
        color="secondary"
        fullWidth
      >
        {isLoggedIn ? "Log Out" : "Log In"}
      </Button>

      {account ? (
        <>
          <WalletDetails />
          <Button
            variant="contained"
            onClick={deactivate}
            color="secondary"
            sx={{ marginY: "0.25rem" }}
            fullWidth
          >
            Disconnect Wallet
          </Button>
        </>
      ) : (
        <ConnectWalletButtons />
      )}
    </>
  );
};

export default AccountOptions;
