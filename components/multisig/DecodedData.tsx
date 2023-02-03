import React, { useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Badge from "../common/Badge";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { ADDRESS_NAMES } from "../../config";
import { KECCAK_ROLES } from "../../constants";
import { decodeData } from "../../features/DecodedDataSlice";

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
      // FIXME: decimals for tokens may not necessarily be 18
      const parsedValue = ethers.utils.formatUnits(stringValue, 18);
      return (
        <Badge variant="h5" sx={{ background: color }}>
          {Number(parsedValue)}
        </Badge>
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

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { txnDetails } = transactionSlice;
  const { data } = txnDetails || {};

  const decodedDataSlice = useSelector((state: RootState) => state.decodedData);
  const { data: decodedData, loading } = decodedDataSlice;
  const { fnName, fnType, decoded, inputs } = decodedData || {};

  const isDataDecoded = !!decodedData && !!Object.keys(decodedData).length;

  const decodedDataString = JSON.stringify(decodedData);

  const decodedDataParams = useMemo((): any[] | undefined => {
    if (decodedData === null || !isDataDecoded) return [];
    return decoded?.map((value, index) => ({
      value,
      type: inputs![index]!.type,
    }));
  }, [decodedDataString]);

  // Setting data has unintended positive effect:
  // Since data is a string which has not changed,
  // there is no need to make a new request to decode the same string
  useEffect(() => {
    if (!!data) {
      dispatch(decodeData(data));
    }
  }, [data]);

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
