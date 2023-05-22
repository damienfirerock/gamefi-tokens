import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import InteractButton from "../../common/InteractButton";

import { AppDispatch, RootState } from "../../../store";
import { truncateString } from "../../../utils/common";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import { setLoading } from "../../../features/TransactionSlice";
import useSignature from "../../../utils/hooks/useSignature";

const WalletDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { account, walletKey } = useActiveWeb3React();
  const { checkSignature } = useSignature();

  const { data: session } = useSession();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const [signStatus, setSignStatus] = useState<boolean>(false);

  const handleSignature = async () => {
    if (!session) return;

    dispatch(setLoading(true));

    const response = await checkSignature(session!.user.email!);
    setSignStatus(!!response);

    dispatch(setLoading(false));
  };

  return (
    <Box sx={{ marginY: "0.5rem" }}>
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
  );
};

export default WalletDetails;
