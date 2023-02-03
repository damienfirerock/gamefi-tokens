import React, { useMemo } from "react";
import { ethers } from "ethers";
import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { red, green } from "@mui/material/colors/";
import DoneIcon from "@mui/icons-material/Done";
import { useSelector } from "react-redux";

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

const Badge = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: "inline",
  color: "white",
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 5,
}));

const TransactionDetails: React.FunctionComponent = () => {
  const theme = useTheme();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { txnDetails, decodedData, confirmationsRequired } = transactionSlice;

  const { to, value, data, executed, confirmations } = txnDetails || {};
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
    <>
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
                  ) : (
                    <Badge
                      variant="h5"
                      sx={{ background: theme.palette.primary.main }}
                    >
                      Unable to Decode Data
                    </Badge>
                  )}
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
    </>
  );
};

export default TransactionDetails;
