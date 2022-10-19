import React from "react";
import { useDispatch, useSelector } from "react-redux";

import AccountButton from "./AccountButton";
import AlertBar from "../../common/AlertBar";

import { AppDispatch, RootState } from "../../../store";
import { clearError } from "../../../features/TransactionsSlice";

const WalletButton: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Transactions error should be shown here instead of TransactionsButton
  // TransactionsButton is conditionally rendered depending on whether there is a wallet
  // As such, errors arising from missing wallet will not show if error is shown via TransactionsButton
  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { error } = transactionsSlice;

  return (
    <>
      <AccountButton />
      <AlertBar
        severity="warning"
        text={error}
        handleClearAlertSource={() => dispatch(clearError())}
      />
    </>
  );
};

export default WalletButton;
