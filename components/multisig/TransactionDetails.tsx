import React, { useEffect, useState } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useMultiSigTransactions from "../../utils/hooks/useMultiSigTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { ADDRESS_NAMES } from "../../config";
import { submitSignature } from "../../features/MultiSigSlice";
import { MultiSigTxnType } from "../../pages/api/multisig";

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

const TransactionDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account, requestConnect } = useConnectWallet();

  const {
    isOwner,
    txIndex,
    txnDetails,
    sigDetails,
    getTransactionCount,
    getSignatureDetails,
    getTransactionDetails,
    getTxnSignature,
  } = useMultiSigTransactions();

  const { to, value, data, executed, confirmations, userConfirmed } =
    txnDetails || {};

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { loading: multiSigLoading } = multiSigSlice;

  const [loading, setLoading] = useState<boolean>(false);

  const setupInitial = async () => {
    setLoading(true);

    const nextTxnCount = await getTransactionCount();
    const latestTxnIndex = nextTxnCount - 1;

    setupTxn(latestTxnIndex);

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
  console.log({ txnDetails });

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
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
          <Typography variant="h5">Executed: {executed!.toString()}</Typography>
          <Typography variant="h5">Confirmations: {confirmations}</Typography>
        </>
      )}
      {executed && (
        <Typography variant="h4">Transaction has been executed</Typography>
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
            text={`Submit Signature to ${userConfirmed ? "revoke" : "confirm"}`}
            method={handleSubmitSignature}
            loading={loading || multiSigLoading}
          />
        </>
      )}
    </ContractsBox>
  );
};

export default TransactionDetails;
