import React from "react";
import { Alert, Link } from "@mui/material";

import { getEtherscanLink } from "../../utils/web3";
import { truncateString } from "../../utils/common";

interface ICrystalTransactions {
  transaction: {
    transactionType: string;
    hash: string;
    amount: string;
    status: string;
    createdAt: string;
  } | null;
}

const CrystalTransactions: React.FunctionComponent<ICrystalTransactions> = (
  props
) => {
  const { transaction } = props;

  return (
    <>
      {transaction && (
        <Alert
          severity={transaction.status === "Success" ? "success" : "info"}
          sx={{ mb: 10 }}
        >
          {transaction.createdAt} |{" "}
          <Link
            href={getEtherscanLink(transaction.hash, "transaction")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateString(transaction.hash)}
          </Link>{" "}
          | {transaction.transactionType} | {transaction.amount} $FRG |{" "}
          {transaction.status}
        </Alert>
      )}
    </>
  );
};

export default CrystalTransactions;
