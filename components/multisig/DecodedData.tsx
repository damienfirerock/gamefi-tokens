import React, { useEffect, useMemo } from "react";
import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Badge from "../common/Badge";

import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";
import { AppDispatch, RootState } from "../../store";
import { ADDRESS_NAMES } from "../../config";
import { DEFAULT_DECIMALS, KECCAK_ROLES } from "../../constants";
import { clearDecimals, decodeData } from "../../features/DecodedDataSlice";
import { formatTokenValue } from "../../utils/common";

const nextParamValue = (param: {
  type: string;
  value: any;
  color?: string;
  tokenDecimals: number | null;
}) => {
  const { type, value, color, tokenDecimals } = param;
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
      // Note: This assumes that all uint256 details deal with token transfers/mint
      // Currently, this would be the case
      const numberValue = Number(value);
      const stringValue = numberValue.toString();
      const nextDecimals =
        (tokenDecimals !== 0 && tokenDecimals) || DEFAULT_DECIMALS;
      const parsedValue = formatTokenValue(stringValue, nextDecimals);
      return (
        <>
          <Badge variant="h5" sx={{ background: color }}>
            {Number(parsedValue)}
          </Badge>{" "}
          {Number(value)} ({nextDecimals} Decimals)
        </>
      );
    case "bytes32":
      return (
        <>
          {KECCAK_ROLES[value] && (
            <Badge variant="h5" sx={{ background: color }}>
              {KECCAK_ROLES[value]}
            </Badge>
          )}{" "}
          {value}
        </>
      );
    default:
      return JSON.stringify(value);
  }
};

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

const DecodedData: React.FunctionComponent = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { getTokenDecimals } = useWeb3Transactions();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { txnDetails } = transactionSlice;
  const { to, data } = txnDetails || {};

  const decodedDataSlice = useSelector((state: RootState) => state.decodedData);
  const { data: decodedData, decimals, loading } = decodedDataSlice;
  const { fnName, fnType, decoded, inputs } = decodedData || {};

  const isDataDecoded = !!decodedData && !!Object.keys(decodedData).length;

  const decodedDataString = JSON.stringify(decodedData);
  const inputString = JSON.stringify(inputs);

  const decodedDataParams = useMemo((): any[] | undefined => {
    if (decodedData === null || !isDataDecoded) return [];
    return decoded?.map((value, index) => ({
      value,
      type: inputs![index]!.type,
    }));
  }, [decodedDataString]);

  const isTokenTransfer = useMemo((): boolean => {
    if (!inputs || !inputs.length || !to) return false;

    // If there is a value sent to an address,
    // this is highly likely to be a token transfer
    if (
      inputs.find(({ type }) => type === "address") &&
      inputs.find(({ type }) => type === "uint256")
    ) {
      return true;
    }

    return false;
  }, [inputString]);

  // Setting data as a dependency has unintended positive effect:
  // Since data is a string which has not changed,
  // there is no need to make a new request to decode the same string
  useEffect(() => {
    if (!!data) {
      dispatch(decodeData(data));
      dispatch(clearDecimals());
    }
  }, [data]);

  useEffect(() => {
    if (!isTokenTransfer) return;

    // to is confirmed because isTokenTransfer will return false if !to
    getTokenDecimals(to!);
  }, [isTokenTransfer]);

  if (loading) return <CircularProgress size={12} color="primary" />;

  return (
    <>
      {isDataDecoded ? (
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
          <Typography variant="h5" style={{ display: "inline" }}></Typography>

          {decodedDataParams?.map((param) => (
            <DecodedBox key={param.value}>
              <DecodedHeaderBox>
                <Typography variant="h5">{param.type}:</Typography>
              </DecodedHeaderBox>{" "}
              <DecodedInfoBox>
                <Typography variant="h5" style={{ wordWrap: "break-word" }}>
                  {nextParamValue({
                    ...param,
                    color: theme.palette.primary.main,
                    tokenDecimals: decimals,
                  })}
                </Typography>
              </DecodedInfoBox>
            </DecodedBox>
          ))}
        </TxDetailsInfoBox>
      ) : (
        <Badge variant="h5" sx={{ background: theme.palette.primary.main }}>
          Unable to Decode Data
        </Badge>
      )}
    </>
  );
};

export default DecodedData;
