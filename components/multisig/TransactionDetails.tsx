import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { red, green } from "@mui/material/colors/";
import DoneIcon from "@mui/icons-material/Done";
import { useSelector } from "react-redux";

import DecodedData from "./DecodedData";
import Badge from "../common/Badge";

import { RootState } from "../../store";
import { ADDRESS_NAMES } from "../../config";
import { DEFAULT_DECIMALS } from "../../constants";
import { formatTokenValue } from "../../utils/common";

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

const TransactionDetails: React.FunctionComponent = () => {
  const theme = useTheme();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { txnDetails, confirmationsRequired } = transactionSlice;
  const { to, value, data, executed, confirmations } = txnDetails || {};

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
                  <Typography variant="h5">
                    {value &&
                      formatTokenValue(value.toString(), DEFAULT_DECIMALS)}{" "}
                    MATIC
                  </Typography>
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
                {/* Decoded Data */}
                <BottomTxDetailsBox>
                  <DecodedData />
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
