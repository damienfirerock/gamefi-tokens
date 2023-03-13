import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useAirdropTransactions from "../../utils/hooks/useAirdropTransactions";
import { setLoading } from "../../features/TransactionSlice";
import { getMerkleProof, generateMerkleTree } from "../../utils/merkleAirdrop";
import { parseTokenValue } from "../../utils/common";
import { AIRDROP_DETAILS } from "../../constants/common";
import { AirdropType, IAirDropDetails } from "../../interfaces/IAirdrop";
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";

const nextAirdropDetails = (): IAirDropDetails => {
  const nextAirdrop = JSON.parse(JSON.stringify(AIRDROP_DETAILS));
  for (let key of Object.keys(nextAirdrop.airdrop)) {
    nextAirdrop.airdrop[key] = nextAirdrop.airdrop[key] * 2;
  }
  return nextAirdrop;
};

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

const CumulativeAirdrop: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("airdrop");

  const { account } = useActiveWeb3React();
  const {
    checkPastClaim,
    getMerkleRoot,
    setNextMerkleRoot,
    checkWalletBalance,
    submitClaim,
  } = useAirdropTransactions(AirdropType.CUMULATIVE);

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { pastClaimed, merkleRoot, walletBalance } = airdropSlice;

  const [airdropDetails, setAirdropDetails] =
    useState<IAirDropDetails>(AIRDROP_DETAILS);

  const setupInitial = async () => {
    dispatch(setLoading(true));

    await checkPastClaim();
    await getMerkleRoot();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  const handleSetMerkleRoot = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const nextTree = generateMerkleTree(airdropDetails);
    const hash = nextTree.getHexRoot();

    await setNextMerkleRoot(hash);

    dispatch(setLoading(false));

    setAirdropDetails(nextAirdropDetails);
  };

  const resetMerkleRoot = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const nextTree = generateMerkleTree(AIRDROP_DETAILS);
    const hash = nextTree.getHexRoot();

    await setNextMerkleRoot(hash);

    dispatch(setLoading(false));

    setAirdropDetails(AIRDROP_DETAILS);
  };

  const handleClaim = async () => {
    if (!account) return;

    dispatch(setLoading(true));

    const amount = parseTokenValue(
      airdropDetails.airdrop[account].toString(),
      18
    );
    const proof = getMerkleProof(
      account,
      airdropDetails.airdrop[account],
      airdropDetails
    );

    await submitClaim(BigInt(Number(amount)), proof);
    await checkPastClaim();
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
          padding: 3,
          border: "1px solid #D3D3D3",
          borderRadius: 5,
          marginBottom: 3,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          <code style={{ whiteSpace: "pre-line" }}>
            {JSON.stringify(airdropDetails, null, 4)}
          </code>
        </Typography>

        {account && (
          <Box>
            <InteractButton
              text={`${t("set-new")} ${t("merkle-root")}`}
              method={handleSetMerkleRoot}
              loading={loading}
            />
            <InteractButton
              text={`${t("reset")} ${t("merkle-root")}`}
              method={resetMerkleRoot}
              loading={loading}
            />
          </Box>
        )}
      </Box>

      {account && (
        <>
          {" "}
          <Typography variant="h3">
            {" "}
            {t("claimed")}: {pastClaimed}
          </Typography>
          {/* Show the merkle root */}
          <Typography variant="h5">
            {t("merkle-root")}: {merkleRoot}
          </Typography>
          {/* Show current balance */}
          <Typography variant="h5">
            $FRG {t("balance")}: {walletBalance}
          </Typography>
          <InteractButton
            text={t("claim")}
            method={handleClaim}
            loading={loading}
          />
        </>
      )}
    </>
  );
};

export default CumulativeAirdrop;
