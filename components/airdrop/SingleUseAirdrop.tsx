import React, { useEffect } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useAirdropTransactions from "../../utils/hooks/useAirdropTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { setLoading } from "../../features/TransactionSlice";
import { getMerkleProof } from "../../utils/merkleAirdrop";
import { parseTokenValue } from "../../utils/common";
import { AIRDROP_DETAILS } from "../../constants/common";
import { AirdropType } from "../../interfaces/IAirdrop";
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

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

  const { account } = useActiveWeb3React();
  const { account: originalAccount, requestConnect } = useConnectWallet();
  const { checkIfClaimed, getMerkleRoot, checkWalletBalance, submitClaim } =
    useAirdropTransactions(AirdropType.SINGLE_USE);

  const connectedAddress = account || originalAccount;

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
    if (!connectedAddress) return;

    dispatch(setLoading(true));

    const amount = parseTokenValue(
      AIRDROP_DETAILS.airdrop[connectedAddress].toString(),
      18
    );
    const proof = getMerkleProof(
      connectedAddress,
      AIRDROP_DETAILS.airdrop[connectedAddress],
      AIRDROP_DETAILS
    );

    await submitClaim(BigInt(Number(amount)), proof);
    await checkIfClaimed();
    await checkWalletBalance();

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (connectedAddress) {
      setupInitial();
    }
  }, [connectedAddress]);

  return (
    <>
      {/* Show button to connect if not connected */}
      {!connectedAddress && (
        <StyledBox>
          <InteractButton
            text="Connect"
            method={requestConnect}
            loading={loading}
            disabled={hasClaimed}
          />
        </StyledBox>
      )}

      {connectedAddress && (
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
