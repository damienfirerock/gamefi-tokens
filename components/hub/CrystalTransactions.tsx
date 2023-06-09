import React from "react";
import {
  Box,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import { getEtherscanLink } from "../../utils/web3";
import { truncateString, formatNumberValue } from "../../utils/common";
import {
  HubTransactionType,
  IHubTransaction,
  HubTransactionStatus,
} from "../../interfaces/ITransaction";
import { DISABLED_COLOUR, NAV_TEXT_COLOUR } from "../../src/theme";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.7rem",
    padding: "0.2rem 0 0.2rem",
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.7rem",
    padding: "0.6rem 0 0.6rem",
    borderBottom: `0.5px solid ${DISABLED_COLOUR}20`,
  },
}));

const getTransactionStatusIcon = (status: HubTransactionStatus) => {
  switch (status) {
    case HubTransactionStatus.Success:
      return (
        <CheckIcon
          sx={{ fontSize: "0.9rem", marginTop: "0.1rem", color: "green" }}
        />
      );
    case HubTransactionStatus.Failure:
      return (
        <CloseIcon
          sx={{ fontSize: "0.9rem", marginTop: "0.1rem", color: "red" }}
        />
      );
    case HubTransactionStatus.Pending:
      return (
        <HourglassTopIcon sx={{ fontSize: "0.9rem", marginTop: "0.1rem" }} />
      );
    default:
      return null; // or some default icon
  }
};

interface ICrystalTransactions {
  transaction: IHubTransaction | null;
}

const CrystalTransactions: React.FunctionComponent<ICrystalTransactions> = (
  props
) => {
  const { transaction } = props;

  return (
    <>
      <Box
        sx={{
          marginBottom: "0.3rem",
          color: NAV_TEXT_COLOUR,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption">Transactions</Typography>
        <IconButton aria-label="Refresh Transactions" size="small">
          <RefreshIcon sx={{ color: NAV_TEXT_COLOUR }} fontSize="small" />
        </IconButton>
      </Box>
      {transaction && (
        <TableContainer component={Paper} sx={{ marginBottom: "1rem" }}>
          <Table aria-label="Transactions Table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Txn Hash</StyledTableCell>
                <StyledTableCell align="center">Server</StyledTableCell>
                <StyledTableCell align="center">Crystal</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                transaction,
                transaction,
                transaction,
                transaction,
                transaction,
              ].map((row) => (
                <TableRow
                  key={row.hash}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="center">
                    {row.createdAt}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Link
                      href={getEtherscanLink(row.hash, "transaction")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {truncateString(row.hash)}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.server}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.transactionType === HubTransactionType.Withdrawal &&
                      "-"}
                    {formatNumberValue(Number(row.amount))}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getTransactionStatusIcon(row.status)}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CrystalTransactions;
