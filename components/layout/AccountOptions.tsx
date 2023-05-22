import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import ConnectWalletButtons from "./buttons/ConnectWalletButtons";
import GameAccountDetails from "../main/GameAccountDetails";
import InteractButton from "../common/InteractButton";

import { AppDispatch, RootState } from "../../store";
import { truncateString } from "../../utils/common";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";
import { setDialogOpen } from "../../features/AuthSlice";
import { setLoading } from "../../features/TransactionSlice";
import useSignature from "../../utils/hooks/useSignature";

// FIXME: Need to double try connect with Metamask on Walletconnect ??
// FIXME: Metamask Button does not work if not on ChainId
// TODO: Potential issues in the future as font size between chinese and english text are clearly different

const AccountOptions: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();
  const { checkSignature } = useSignature();

  const { data: session, status } = useSession();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const [signStatus, setSignStatus] = useState<boolean>(false);

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  const handleLogOut = async () => {
    await signOut();
  };

  const handleSignature = async () => {
    if (!session) return;

    dispatch(setLoading(true));

    const response = await checkSignature(session!.user.email!);
    setSignStatus(!!response);

    dispatch(setLoading(false));
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

      <Box sx={{ marginY: "1rem" }}>
        <Typography variant="body2">Connect Wallet</Typography>
        <Typography variant="body2">
          {!!account && truncateString(account)}
        </Typography>
        {account && (
          <>
            <Typography variant="body2">
              Signed:{signStatus.toString()}
            </Typography>
            <InteractButton
              text={"Sign"}
              method={handleSignature}
              loading={loading}
              variant="contained"
              sx={{ marginY: "0.25rem" }}
              fullWidth
            />
          </>
        )}
      </Box>
      {account ? (
        <Button
          variant="contained"
          onClick={deactivate}
          color="secondary"
          sx={{ marginY: "0.25rem" }}
          fullWidth
        >
          Disconnect Wallet
        </Button>
      ) : (
        <ConnectWalletButtons />
      )}
    </>
  );
};

export default AccountOptions;
