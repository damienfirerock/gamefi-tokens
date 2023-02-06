import React, { useEffect } from "react";
import { Box, BoxProps, Button, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useDispatch, useSelector } from "react-redux";

import Transactions from "../multisig/Transactions";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useMultiSigTransactions from "../../utils/hooks/useMultiSigTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { setLoading } from "../../features/TransactionSlice";

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

const MultiSigInformation: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();
  const { checkIfMultiSigOwner } = useMultiSigTransactions();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { isOwner, owners } = multiSigSlice;

  const setupInitial = async () => {
    dispatch(setLoading(true));

    await checkIfMultiSigOwner();

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

      {/* Do not show info if account is not a multisig owner */}
      {account && !isOwner && (
        <StyledBox>
          <Typography variant="h3">Not Authorised</Typography>
        </StyledBox>
      )}

      {/* If connected as multisig owner,
      Show transaction data and relevant address links */}
      {account && isOwner && (
        <>
          <Transactions />

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
                  {owners?.includes(address) && (
                    <AssignmentIndIcon color="success" />
                  )}
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

export default MultiSigInformation;
