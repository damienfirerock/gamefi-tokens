import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  Link,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import { StyledCircularProgress } from "../product/common/PokemonCard";

import useMultiSigTransactionsMetamask from "../../utils/hooks/useMultiSigTransactionsMetamask";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";

// https://github.com/vercel/next.js/issues/19420

const addresses = Object.values(CONTRACT_ADDRESSES);

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(4, 0),
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
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const {
    isOwner,
    getTransactionCount,
    getTransactionDetails,
    getOwnerConfirmationStatus,
    checkIfMultiSigOwner,
    getTxnSignature,
  } = useMultiSigTransactionsMetamask();

  const [txnCount, setTxnCount] = useState<number>(0);
  const [txn, setTxn] = useState<Array<any>>([]);
  const [txIndex, setTxIndex] = useState<number | null>(null);
  const [txnConfirmed, setTxnConfirmed] = useState<boolean>(false);

  const setUpDetails = async () => {
    const nextTxnCount = await getTransactionCount();
    setTxnCount(nextTxnCount);
    const nextTxn = await getTransactionDetails(nextTxnCount - 1);
    setTxn(nextTxn);
    setTxIndex(nextTxnCount - 1);
    await checkIfMultiSigOwner();

    if (nextTxn.length === 5 && !nextTxn[3].executed) {
      const userConfirmation = await getOwnerConfirmationStatus(
        nextTxnCount - 1
      );
      setTxnConfirmed(userConfirmation);
    }
  };

  const getSignature = async () => {
    if (typeof txIndex === "number") await getTxnSignature(txIndex);
  };

  useEffect(() => {
    if (account) {
      setUpDetails();
    }
  }, [account]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h4">
            * This is on the Polygon Mumbai Testnet. Faucet:{" "}
            <Link
              href={"https://faucet.polygon.technology/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              https://faucet.polygon.technology/
            </Link>
          </Typography>
        </StyledBox>
        <StyledBox>
          <Typography variant="h2">
            {txnCount || ""} MultiSig Transactions
          </Typography>
        </StyledBox>
        <StyledBox>
          {!account && (
            <InteractButton
              text="Connect"
              method={requestConnect}
              loading={false}
            />
          )}
        </StyledBox>

        {account && !isOwner && (
          <StyledBox>
            <Typography variant="h3">Not Authorised</Typography>
          </StyledBox>
        )}

        {account && isOwner && (
          <>
            <ContractsBox>
              <Typography variant="h4">Latest Transaction</Typography>
              {txnCount > 0 && txn.length === 5 && (
                <>
                  <Typography variant="h5">
                    To: {txn[0]}
                    {ADDRESS_NAMES[txn[0]] && `(${ADDRESS_NAMES[txn[0]]})`}
                  </Typography>
                  <Typography variant="h5">Value: {Number(txn[1])}</Typography>
                  <Typography variant="h5">Data: {txn[2]}</Typography>
                  <Typography variant="h5">
                    Executed: {txn[3].toString()}
                  </Typography>
                  <Typography variant="h5">
                    Confirmations: {Number(txn[4])}
                  </Typography>
                </>
              )}
              {txn[3] && (
                <Typography variant="h4">
                  Transaction has been executed
                </Typography>
              )}
              {txn.length === 5 && !txn[3] && (
                <>
                  <Typography variant="h4">
                    You may still {txnConfirmed ? "revoke" : "confirm"} the
                    transaction.
                  </Typography>
                  <InteractButton
                    text={`Submit Signature to ${
                      txnConfirmed ? "revoke" : "confirm"
                    }`}
                    method={getSignature}
                    loading={false}
                  />
                </>
              )}
            </ContractsBox>
            <ContractsBox>
              <Typography variant="h3">Contracts</Typography>
              {addresses.map((address) => {
                if (!address) return;
                return (
                  <Typography variant="h4" key={address}>
                    {ADDRESS_NAMES[address]}:{" "}
                    <Link
                      href={`${CONFIG.polygonScanUrl}${address}`}
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
    </Layout>
  );
};

export default MainPage;
