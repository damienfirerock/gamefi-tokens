import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  IconButton,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { red, green } from "@mui/material/colors/";
import DoneIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import useMultiSigTransactions from "../../utils/hooks/useMultiSigTransactions";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import { ADDRESS_NAMES } from "../../config";
import { submitSignature } from "../../features/MultiSigSlice";
import { MultiSigTxnType } from "../../pages/api/multisig";

const numberOfButtons = 9;
const sideButtonNumber = Math.floor(numberOfButtons / 2);

const generateArray = (numberOfButtons: number, initialPage: number) => {
  return Array.from({ length: numberOfButtons }, (_, i) => i + initialPage);
};

const nextParamValue = (param: {
  type: string;
  value: any;
  color?: string;
}) => {
  const { type, value, color } = param;
  switch (type) {
    case "address":
      return (
        <>
          {ADDRESS_NAMES[value!] && (
            <Badge variant="h5" sx={{ background: color }}>
              {ADDRESS_NAMES[value!]}
            </Badge>
          )}{" "}
          {value}
        </>
      );
    case "uint256":
      const numberValue = Number(value);
      const stringValue = numberValue.toString();
      const parsedValue = ethers.utils.formatUnits(stringValue, 18);
      return (
        <Badge variant="h5" sx={{ background: color }}>
          {Number(parsedValue)}
        </Badge>
      );
    case "bytes32":
      // This is usually due to granting of roles
      // roles are generated from keccak hashes
      // Therefore, the only way to compare would be to check against all role hashes in contracts
      // 1 way would be to request for all role data everytime the client is booted
      // Other way would be to list the keccak hashes in a constants file
      // Second way seems more do-able since smart contract roles are unable to change much
      return value;
    default:
      return JSON.stringify(value);
  }
};

const SectionBox = styled(Box)<BoxProps>(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
}));

const TxDetailsContainer = styled(Box)<BoxProps>(() => ({
  display: "inline-flex",
}));

// Note: Probably a DRY method for not having borders clash between BottomTxDetailsBoxes in TransactionDetails
const TxDetailsBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  minWidth: 650,
  border: "1px solid #D3D3D3",
  borderBottom: 0,
  padding: theme.spacing(1),
}));

const BottomTxDetailsBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  minWidth: 650,
  border: "1px solid #D3D3D3",
  padding: theme.spacing(1),
}));

const TxDetailsHeaderBox = styled(Box)<BoxProps>(() => ({
  width: 150,
  textAlign: "left",
}));

const TxDetailsInfoBox = styled(Box)<BoxProps>(() => ({
  maxWidth: 500,
  textAlign: "left",
}));

const DecodedBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  minWidth: 650,
}));

const DecodedHeaderBox = styled(Box)<BoxProps>(() => ({
  width: 90,
  textAlign: "left",
}));

const DecodedInfoBox = styled(Box)<BoxProps>(() => ({
  maxWidth: 500,
  textAlign: "left",
}));

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  margin: theme.spacing(0.25),
}));

const Badge = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: "inline",
  color: "white",
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 5,
}));

const PageButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled } = props;
  return (
    <StyledButton
      variant="outlined"
      size="small"
      onClick={method}
      disabled={loading || disabled}
    >
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </StyledButton>
  );
};

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  variant?: "text" | "outlined" | "contained";
}) => {
  const { text, method, loading, variant = "contained" } = props;
  return (
    <Button
      variant={variant}
      onClick={method}
      disabled={loading}
      sx={{ marginX: 0.5 }}
    >
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const TransactionDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const { account } = useConnectWallet();

  // Note: May need to move hook state to redux
  // in the event that app becomes more complex,
  // but this is unlikely unless the app deals with more than the multisig
  const {
    txIndex,
    txCount,
    txnDetails,
    decodedData,
    sigDetails,
    confirmationsRequired,
    setTxnIndex,
    getTransactionCount,
    getSignatureDetails,
    getNumOfConfirmationsRequired,
    getTransactionDetails,
    getTxnSignature,
    runTransaction,
  } = useMultiSigTransactions();

  const { to, value, data, executed, confirmations, userConfirmed } =
    txnDetails || {};
  const { fnName, fnType, decoded, inputs } = decodedData || {};

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { loading: multiSigLoading } = multiSigSlice;

  const [loading, setLoading] = useState<boolean>(false);

  const decodedDataString = JSON.stringify(decodedData);
  const decodedDataParams = useMemo((): any[] | undefined => {
    if (decodedData === null || !Object.keys(decodedData).length) return [];
    return decoded?.map((value, index) => ({
      value,
      type: inputs![index]!.type,
    }));
  }, [decodedDataString]);

  const txNumbers = useMemo((): number[] => {
    const lastNumber = txCount - 1;

    let array: number[] = [];

    if (txCount < numberOfButtons) {
      // less transactions than number of buttons to show
      array = generateArray(txCount, 0);
    } else if (
      txIndex === lastNumber ||
      txCount - txIndex <= sideButtonNumber
    ) {
      // when index is at last transaction, or near the end
      const initialPage = txCount - numberOfButtons;
      array = generateArray(numberOfButtons, initialPage);
    } else if (
      txIndex - sideButtonNumber >= 0 &&
      txCount > txIndex + sideButtonNumber
    ) {
      // index is more than <sideButtonNumber> of buttons before the end
      // there are also more transactions than can be shown
      const initialPage = txIndex - sideButtonNumber;
      array = generateArray(numberOfButtons, initialPage);
    } else if (txIndex - sideButtonNumber < 0) {
      // index is near the start
      array = generateArray(numberOfButtons, 0);
    }

    return array;
  }, [txIndex, txCount]);

  const shouldShowLatestButton = useMemo((): boolean => {
    if (txCount - txIndex > sideButtonNumber + 1) return true;

    return false;
  }, [txIndex, txCount]);

  const setupTxn = async (nextTxIndex: number) => {
    const nextIndex = nextTxIndex;

    if (!nextIndex && nextIndex !== 0) return;

    const nextTxn = await getTransactionDetails(nextIndex);

    if (nextTxn && !nextTxn.executed) {
      await getSignatureDetails(nextIndex);
    }
  };

  const getTransaction = async (nextIndex: number) => {
    setLoading(true);

    await setupTxn(nextIndex);
    setTxnIndex(nextIndex);

    setLoading(false);
  };

  const setupInitial = async () => {
    const nextTxnCount = await getTransactionCount();
    const latestTxnIndex = nextTxnCount - 1;

    await getNumOfConfirmationsRequired();
    await setupTxn(latestTxnIndex);

    setLoading(false);
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

  const handleSubmitSignatureForExecution = async () => {
    setLoading(true);
    if (typeof txIndex === "number") {
      const signature = await getTxnSignature(txIndex);

      if (signature) {
        const { hash, ...details } = sigDetails!;

        const type = MultiSigTxnType.EXECUTE;

        await dispatch(submitSignature({ signature, type, ...details }));
        await setupTxn(txIndex);
      }
    }
    setLoading(false);
  };

  const handleRunTransaction = async (type: MultiSigTxnType) => {
    setLoading(true);
    if (typeof txIndex === "number") {
      await runTransaction(txIndex, type);
      await setupTxn(txIndex);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <>
      <SectionBox>
        <Typography variant="h4">
          Transaction - {txIndex} {txIndex === txCount - 1 && "(Latest)"}
        </Typography>
      </SectionBox>

      {/* Pagination */}
      <SectionBox>
        {txNumbers.map((number) => (
          <PageButton
            key={number}
            text={number.toString()}
            method={() => getTransaction(number)}
            disabled={number === txIndex}
            loading={loading}
          />
        ))}

        {shouldShowLatestButton && (
          <PageButton
            text="latest"
            method={() => getTransaction(txCount - 1)}
            loading={loading}
          />
        )}

        <IconButton color="primary" onClick={setupInitial} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </SectionBox>

      {/* Details */}
      {!!txnDetails && (
        <SectionBox>
          <TxDetailsContainer>
            <Box>
              <TxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">To:</Typography>
                </TxDetailsHeaderBox>
                <TxDetailsInfoBox>
                  {ADDRESS_NAMES[to!] && (
                    <Badge
                      variant="h5"
                      sx={{ background: theme.palette.primary.main }}
                    >
                      {ADDRESS_NAMES[to!]}
                    </Badge>
                  )}{" "}
                  <Typography variant="h5">{to}</Typography>
                </TxDetailsInfoBox>
              </TxDetailsBox>
              <TxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">Value:</Typography>
                </TxDetailsHeaderBox>
                <TxDetailsInfoBox>
                  <Typography variant="h5">{value} MATIC</Typography>
                </TxDetailsInfoBox>
              </TxDetailsBox>
              <TxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">Data:</Typography>
                </TxDetailsHeaderBox>
                <TxDetailsInfoBox>
                  <Typography variant="h5" style={{ wordWrap: "break-word" }}>
                    {data}
                  </Typography>
                </TxDetailsInfoBox>
              </TxDetailsBox>
              <TxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">Decoded Data:</Typography>
                </TxDetailsHeaderBox>
                <BottomTxDetailsBox>
                  <TxDetailsInfoBox>
                    <DecodedBox>
                      <DecodedHeaderBox>
                        <Typography variant="h5"> {fnType}</Typography>
                      </DecodedHeaderBox>
                      <DecodedInfoBox>
                        <Badge
                          variant="h5"
                          sx={{ background: theme.palette.primary.main }}
                        >
                          {fnName}
                        </Badge>
                      </DecodedInfoBox>
                    </DecodedBox>
                    <Typography
                      variant="h5"
                      style={{ display: "inline" }}
                    ></Typography>

                    {decodedDataParams?.map((param) => (
                      <DecodedBox key={param.value}>
                        <DecodedHeaderBox>
                          <Typography variant="h5">{param.type}:</Typography>
                        </DecodedHeaderBox>{" "}
                        <DecodedInfoBox>
                          <Typography
                            variant="h5"
                            style={{ wordWrap: "break-word" }}
                          >
                            {nextParamValue({
                              ...param,
                              color: theme.palette.primary.main,
                            })}
                          </Typography>
                        </DecodedInfoBox>
                      </DecodedBox>
                    ))}
                  </TxDetailsInfoBox>
                </BottomTxDetailsBox>
              </TxDetailsBox>
              <TxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">Executed:</Typography>
                </TxDetailsHeaderBox>
                <TxDetailsInfoBox>
                  <Badge
                    variant="h5"
                    sx={{ background: executed ? green[900] : red[900] }}
                  >
                    {executed ? "Yes" : "No"}
                  </Badge>
                </TxDetailsInfoBox>
              </TxDetailsBox>
              <BottomTxDetailsBox>
                <TxDetailsHeaderBox>
                  <Typography variant="h5">Confirmations:</Typography>
                </TxDetailsHeaderBox>
                <TxDetailsInfoBox>
                  <Typography
                    variant="h5"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {confirmations}/{confirmationsRequired}{" "}
                    {!!confirmations &&
                      confirmations >= confirmationsRequired && (
                        <DoneIcon color="success" />
                      )}
                  </Typography>
                </TxDetailsInfoBox>
              </BottomTxDetailsBox>
            </Box>
          </TxDetailsContainer>
        </SectionBox>
      )}

      {/* Signing */}

      {executed && (
        <SectionBox>
          <Typography variant="h4">Transaction has been executed</Typography>
        </SectionBox>
      )}
      {!!txnDetails && !executed && (
        <>
          <SectionBox>
            <Typography variant="h4">
              You may still{" "}
              {userConfirmed
                ? "revoke your confirmation"
                : "confirm the transaction"}
            </Typography>

            <InteractButton
              text={`${userConfirmed ? "revoke" : "confirm"} Directly`}
              method={() =>
                handleRunTransaction(
                  userConfirmed
                    ? MultiSigTxnType.REVOKE
                    : MultiSigTxnType.CONFIRM
                )
              }
              loading={loading || multiSigLoading}
              variant="outlined"
            />
            <InteractButton
              text={`${userConfirmed ? "revoke" : "confirm"} via Signature`}
              method={handleSubmitSignature}
              loading={loading || multiSigLoading}
            />
          </SectionBox>
          {!!confirmations && confirmations >= confirmationsRequired && (
            <SectionBox>
              <Typography variant="h4">
                You may execute the transaction.
              </Typography>

              <InteractButton
                text="Execute Directly"
                method={() => handleRunTransaction(MultiSigTxnType.EXECUTE)}
                loading={loading || multiSigLoading}
                variant="outlined"
              />
              <InteractButton
                text="Execute via Signature"
                method={handleSubmitSignatureForExecution}
                loading={loading || multiSigLoading}
              />
            </SectionBox>
          )}
          <SectionBox>
            {sigDetails && (
              <Typography variant="h6">
                {`The signing message (${sigDetails.hash}) is a hash of the nonce (${sigDetails.nonce}), txIndex (${sigDetails.txIndex}), and your address (${sigDetails.address})`}
              </Typography>
            )}
          </SectionBox>
        </>
      )}
    </>
  );
};

export default TransactionDetails;
