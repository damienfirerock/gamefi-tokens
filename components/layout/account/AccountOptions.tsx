import React from "react";
import { Button } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

import ConnectWalletButtons from "../buttons/ConnectWalletButtons";
import GameAccountDetails from "./GameAccountDetails";
import WalletDetails from "./WalletDetails";

import { AppDispatch } from "../../../store";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import {
  setDialogOpen,
  setError,
  setAccountDetailsOpen,
} from "../../../features/AuthSlice";

// FIXME: Need to double try connect with Metamask on Walletconnect ??
// FIXME: Metamask Button does not work if not on ChainId
// TODO: Potential issues in the future as font size between chinese and english text are clearly different

const AccountOptions: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();
  const { t } = useTranslation("account");

  const { data: session, status } = useSession();

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  const handleLogOut = async () => {
    try {
      dispatch(setAccountDetailsOpen(null));
      await signOut({ redirect: false });
      // Sign out reloads the page,
      // So unable to show success notification
    } catch (error) {
      setError("Logout Failure");
    }
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
        {isLoggedIn ? t("logout") : t("login")}
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
            {t("disconnect-wallet")}
          </Button>
        </>
      ) : (
        <ConnectWalletButtons />
      )}
    </>
  );
};

export default AccountOptions;
