import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import InteractButton from "../../common/InteractButton";

import { AppDispatch, RootState } from "../../../store";
import { truncateString, formatNumberValue } from "../../../utils/common";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import useCommonWeb3Transactions from "../../../utils/hooks/useCommonWeb3Transactions";
import { setLoading } from "../../../features/AccountSlice";
import useSignature from "../../../utils/hooks/useSignature";
import { SUPPORTED_WALLETS } from "../../../constants/wallets";

const WalletDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { account, walletKey } = useActiveWeb3React();
  const { checkFRGBalance, checkMaticBalance } = useCommonWeb3Transactions();
  const { checkSignature } = useSignature();
  const { data: session } = useSession();

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletFRGBalance, walletMaticBalance, loading } = accountSlice;

  const [signStatus, setSignStatus] = useState<boolean>(false);

  const handleSignature = async () => {
    if (!session) return;

    dispatch(setLoading(true));

    const response = await checkSignature(session!.user.email!);
    setSignStatus(!!response);

    dispatch(setLoading(false));
  };

  const getWalletBalances = async () => {
    dispatch(setLoading(true));
    await checkFRGBalance();
    await checkMaticBalance();
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (!account) return;

    getWalletBalances();
  }, [account]);

  return (
    <Box sx={{ marginY: "0.5rem", maxWidth: 400 }}>
      <Box sx={{ display: "flex", textAlign: "center" }}>
        {walletKey && (
          <Image
            src={SUPPORTED_WALLETS[walletKey].icon}
            alt={`${walletKey} Logo`}
            width="28"
            height="28"
          />
        )}
        <Typography
          variant="body2"
          sx={{ lineHeight: "2rem", marginLeft: "0.5rem" }}
        >
          {account ? <>Wallet: {truncateString(account)} </> : "Connect Wallet"}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{ color: "red", display: "inline-block" }}
      >
        [Mock] The connection wallet address is different from the binding
        address
      </Typography>
      {!loading && account && (
        <>
          <Typography variant="body2">
            MATIC: {formatNumberValue(walletMaticBalance || 0)}
          </Typography>
          <Typography variant="body2">
            $FRG: {formatNumberValue(walletFRGBalance || 0)}
          </Typography>
        </>
      )}
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
  );
};

export default WalletDetails;
