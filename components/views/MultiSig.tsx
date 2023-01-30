import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import TransactionDetails from "../multisig/TransactionDetails";
import StyledCircularProgress from "../common/StyledCircularProgress";
import AlertBar from "../common/AlertBar";

import { AppDispatch, RootState } from "../../store";
import useMultiSigTransactions from "../../utils/hooks/useMultiSigTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { clearError as clearMultiSigError } from "../../features/MultiSigSlice";
import { clearError } from "../../features/TransactionSlice";

const addresses = Object.values(CONTRACT_ADDRESSES);

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0, 0),
}));

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(4, 0, 0),
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

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const MainPage: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();
  const { isOwner, checkIfMultiSigOwner } = useMultiSigTransactions();

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { error: multiSigError } = multiSigSlice;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const [loading, setLoading] = useState<boolean>(false);

  const setupInitial = async () => {
    setLoading(true);

    await checkIfMultiSigOwner();

    setLoading(false);
  };

  const handleClearAlert = () => {
    if (multiSigError) {
      dispatch(clearMultiSigError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">MultiSig Transactions</Typography>
        </StyledBox>

        {!account && (
          <StyledBox>
            <InteractButton
              text="Connect"
              method={requestConnect}
              loading={loading}
            />
          </StyledBox>
        )}

        {account && !isOwner && (
          <StyledBox>
            <Typography variant="h3">Not Authorised</Typography>
          </StyledBox>
        )}

        {account && isOwner && (
          <>
            <TransactionDetails />

            <ContractsBox>
              <Typography variant="h3">Addresses</Typography>
              {addresses.map((address) => {
                if (!address) return;
                return (
                  <Typography variant="h4" key={address}>
                    {ADDRESS_NAMES[address]}:{" "}
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
      </StyledContainer>

      <AlertBar
        severity="warning"
        text={error || multiSigError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default MainPage;
