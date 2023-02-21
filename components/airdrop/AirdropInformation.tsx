import React, { useEffect } from "react";
import { Box, BoxProps, Button, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useAirdropTransactions from "../../utils/hooks/useAirdropTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { setLoading } from "../../features/TransactionSlice";
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
}) => {
  const { text, method, loading } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const AirdropInformation: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();
  const { checkIfClaimed } = useAirdropTransactions();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { hasClaimed } = airdropSlice;

  const setupInitial = async () => {
    dispatch(setLoading(true));

    await checkIfClaimed();

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
          />
        </StyledBox>
      )}

      {account && (
        // && isOwner
        <>
          {/* <Transactions /> */}
          {/* Show JSON file for the airdrop details */}
          <pre>{JSON.stringify(AIRDROP_DETAILS, null, 4)}</pre>

          <Typography variant="h3">Claimed: {hasClaimed.toString()}</Typography>
          {/* Show address of airdrop contract */}
          {/* Show address of FR contract */}

          {/* Check claim status for each participant */}
          {/* Actually claim the airdrop */}
          {/* Update the claim status */}

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
                  {/* {owners?.includes(address) && (
                    <AssignmentIndIcon color="success" />
                  )} */}
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
