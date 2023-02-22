import React, { useEffect } from "react";
import { Box, BoxProps, Button, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useAirdropTransactions from "../../utils/hooks/useAirdropTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { setLoading } from "../../features/TransactionSlice";
import { getMerkleProof } from "../../utils/merkleAirdrop";
import { parseTokenValue } from "../../utils/common";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { AIRDROP_DETAILS } from "../../constants";

const addresses = Object.values(CONTRACT_ADDRESSES);

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
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

const AirdropInformation: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();
  const { checkIfClaimed, getMerkleRoot, checkWalletBalance, submitClaim } =
    useAirdropTransactions();

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
      {/* Show button to connect if not connected */}
      {!account && (
        <StyledBox>
          <InteractButton
            text="Connect"
            method={requestConnect}
            loading={loading}
            disabled={hasClaimed}
          />
        </StyledBox>
      )}

      {account && (
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

          <ContractsBox>
            <Typography variant="h3">Addresses</Typography>
            {addresses.map((address) => {
              if (!address) return;
              return (
                <Typography
                  variant="h4"
                  key={address}
                  sx={{ display: "inline-flex", alignItems: "center" }}
                >
                  {ADDRESS_NAMES[address]}:
                  <Link
                    href={`${CONFIG.POLYGONSCAN_URL}${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </Link>
                </Typography>
              );
            })}
          </ContractsBox>
        </>
      )}
    </>
  );
};

export default AirdropInformation;
