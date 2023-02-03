import React, { useMemo } from "react";
import { ethers } from "ethers";
import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import Badge from "../common/Badge";

import { RootState } from "../../store";
import { ADDRESS_NAMES } from "../../config";
import { KECCAK_ROLES } from "../../constants";

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

const DataDetailsBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  minWidth: 650,
  border: "1px solid #D3D3D3",
  padding: theme.spacing(1),
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

const TransactionDetails: React.FunctionComponent = () => {
  const theme = useTheme();

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

  return (
    <DataDetailsBox>
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
    </DataDetailsBox>
  );
};

export default TransactionDetails;
