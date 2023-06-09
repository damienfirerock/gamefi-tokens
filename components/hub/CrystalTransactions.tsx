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

import { getEtherscanLink } from "../../utils/web3";
import { truncateString, formatNumberValue } from "../../utils/common";
import {
  HubTransactionType,
  IHubTransaction,
} from "../../interfaces/ITransaction";
import { NAV_TEXT_COLOUR } from "../../src/theme";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.7rem",
    padding: "0.2rem 0 0.2rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.7rem",
    padding: "0.7rem 0 0.7rem",
  },
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

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
                  <StyledTableCell align="center">{row.status}</StyledTableCell>
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
