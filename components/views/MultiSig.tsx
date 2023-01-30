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
import StyledCircularProgress from "../common/StyledCircularProgress";
import AlertBar from "../common/AlertBar";

import { AppDispatch, RootState } from "../../store";
import useMultiSigTransactions from "../../utils/hooks/useMultiSigTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import {
  clearError as clearMultiSigError,
  submitSignature,
} from "../../features/MultiSigSlice";
import { clearError } from "../../features/TransactionSlice";
import { MultiSigTxnType } from "../../pages/api/multisig";

// https://github.com/vercel/next.js/issues/19420

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
  const {
    isOwner,
    txnCount,
    txnDetails,
    sigDetails,
    getTransactionCount,
    getSignatureDetails,
    getTransactionDetails,
    checkIfMultiSigOwner,
    getTxnSignature,
  } = useMultiSigTransactions();

  const { to, value, data, executed, confirmations, userConfirmed } =
    txnDetails || {};

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { error: multiSigError, loading: multiSigLoading } = multiSigSlice;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const [txIndex, setTxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setupInitial = async () => {
    setLoading(true);

    const isOwner = await checkIfMultiSigOwner();

    if (isOwner) {
      const nextTxnCount = await getTransactionCount();
      const latestTxnIndex = nextTxnCount - 1;

      setTxIndex(latestTxnIndex);
      setupTxn(latestTxnIndex);
    }

    setLoading(false);
  };

  const setupTxn = async (nextTxIndex?: number) => {
    const nextIndex = nextTxIndex || txIndex;

    if (!nextIndex && nextIndex !== 0) return;

    const nextTxn = await getTransactionDetails(nextIndex);

    if (nextTxn && !nextTxn.executed) {
      await getSignatureDetails(nextIndex);
    }
  };

  const handleSubmitSignature = async () => {
    setLoading(true);
    if (typeof txIndex === "number") {
      const signature = await getTxnSignature(txIndex);

      if (signature) {
        const { hash, ...details } = sigDetails!;

        const type = userConfirmed
          ? MultiSigTxnType.REVOKE
          : MultiSigTxnType.CONFIRM;

        await dispatch(submitSignature({ signature, type, ...details }));
        await setupTxn(txIndex);
      }
    }
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
          <Typography variant="h2">
            {txnCount || ""} MultiSig Transactions
          </Typography>
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
            <ContractsBox>
              <Typography variant="h4">Latest Transaction</Typography>
              {!!txnDetails && (
                <>
                  <Typography variant="h5">
                    To: {to}
                    {ADDRESS_NAMES[to!] && `(${ADDRESS_NAMES[to!]})`}
                  </Typography>
                  <Typography variant="h5">Value: {value}</Typography>
                  <Typography variant="h5">Data: {data}</Typography>
                  <Typography variant="h5">
                    Executed: {executed!.toString()}
                  </Typography>
                  <Typography variant="h5">
                    Confirmations: {confirmations}
                  </Typography>
                </>
              )}
              {executed && (
                <Typography variant="h4">
                  Transaction has been executed
                </Typography>
              )}
              {!!txnDetails && !executed && (
                <>
                  <Typography variant="h4">
                    You may still {userConfirmed ? "revoke" : "confirm"} the
                    transaction.
                  </Typography>
                  {sigDetails && (
                    <Typography variant="h6">
                      {`The signing message (${sigDetails.hash}) is a hash of the nonce (${sigDetails.nonce}), txIndex (${sigDetails.txIndex}), and your address (${sigDetails.address})`}
                    </Typography>
                  )}
                  <InteractButton
                    text={`Submit Signature to ${
                      userConfirmed ? "revoke" : "confirm"
                    }`}
                    method={handleSubmitSignature}
                    loading={loading || multiSigLoading}
                  />
                </>
              )}
            </ContractsBox>

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
