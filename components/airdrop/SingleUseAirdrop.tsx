import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useAirdropTransactions from "../../utils/hooks/useAirdropTransactions";
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";
import { setLoading } from "../../features/TransactionSlice";
import { getMerkleProof } from "../../utils/merkleAirdrop";
import { parseTokenValue } from "../../utils/common";
import { AIRDROP_DETAILS } from "../../constants/common";
import { AirdropType } from "../../interfaces/IAirdrop";

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled = false } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading || disabled}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const SingleUseAirdrop: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common");

  const { account } = useActiveWeb3React();
  const { checkIfClaimed, getMerkleRoot, checkWalletBalance, submitClaim } =
    useAirdropTransactions(AirdropType.SINGLE_USE);

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { hasClaimed, merkleRoot, walletBalance } = airdropSlice;

  const setupInitial = async () => {
    dispatch(setLoading(true));

    await checkIfClaimed();
    await getMerkleRoot();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  const handleClaim = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const amount = parseTokenValue(
      AIRDROP_DETAILS.airdrop[account].toString(),
      18
    );
    const proof = getMerkleProof(
      account,
      AIRDROP_DETAILS.airdrop[account],
      AIRDROP_DETAILS
    );

    await submitClaim(BigInt(Number(amount)), proof);
    await checkIfClaimed();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <>
      {/* Show JSON file for the airdrop details */}
      <Box
        sx={{
          display: "inline-block",
          paddingX: 3,
          border: "1px solid #D3D3D3",
          borderRadius: 5,
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "inline-block", textAlign: "left" }}
        >
          {" "}
          <pre>{JSON.stringify(AIRDROP_DETAILS, null, 4)}</pre>
        </Typography>
      </Box>

      <Link href="/" locale="zh">
        {t("test")}
      </Link>

      {account && (
        <>
          <Typography variant="h3">Claimed: {hasClaimed.toString()}</Typography>
          {/* Show the merkle root */}
          <Typography variant="h5">Merkle Root: {merkleRoot}</Typography>
          {/* Show current balance */}
          <Typography variant="h5">$FRG Balance: {walletBalance}</Typography>
          <InteractButton
            text="Claim"
            method={handleClaim}
            loading={loading}
            disabled={hasClaimed}
          />
        </>
      )}
    </>
  );
};

export default SingleUseAirdrop;
