import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardProps,
  Dialog,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import InteractButton from "../common/InteractButton";
import BlackoutSpots from "./BlackoutSpots";

import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../features/TransactionSlice";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonWeb3Transactions";
import useDispatchErrors from "../../utils/hooks/useDispatchErrors";
import { setSuccess } from "../../features/TransactionSlice";
import {
  setFrgCrystalBalance,
  setPendingFrgCrystalBalance,
} from "../../features/AccountSlice";
import { WHITE } from "../../src/theme";

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  padding: "0.5rem 0.5rem 1rem 0.5rem",
  borderBottom: "1px dashed #979797",
}));

const WithdrawFRGCrystal: React.FunctionComponent<{
  selectedServer: string;
}> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useWeb3React();
  const { checkFRGBalance, checkTransactionStatus } =
    useCommonWeb3Transactions();
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const { selectedServer } = props;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { frgCrystalBalance, pendingFrgCrystalBalance } = accountSlice;

  const hubSlice = useSelector((state: RootState) => state.hub);
  const { data: hubData } = hubSlice;
  const { rate, tax, minimum } = hubData!;

  const [withdrawFRGCrystal, setWithdrawFRGCrystal] = useState<number | null>(
    null
  );
  const [withdrawFRGToken, setWithdrawFRGToken] = useState<number | null>(null);
  const [confirmWithdrawFRGCrystalDialog, setConfirmWithdrawFRGCrystalDialog] =
    useState<boolean>(false);

  const handleWithdrawFRGCrystalAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextCrystalValue = Number(event.target.value);
    setWithdrawFRGCrystal(nextCrystalValue);

    const nextTokenValue = (nextCrystalValue / rate) * (1 - tax / 100);
    setWithdrawFRGToken(nextTokenValue);
  };

  const handleWithdrawFRGCrystal = async () => {
    dispatch(setLoading(true));

    const prevFrgCrystalBalance = frgCrystalBalance!;
    const prevPendingFrgCrystalBalance = pendingFrgCrystalBalance!;
    const nextWithdrawFRGCrystal = withdrawFRGCrystal!;

    dispatch(
      setFrgCrystalBalance(prevFrgCrystalBalance - nextWithdrawFRGCrystal)
    );
    dispatch(
      setPendingFrgCrystalBalance(
        prevPendingFrgCrystalBalance + nextWithdrawFRGCrystal
      )
    );

    const body = JSON.stringify({ account, amount: withdrawFRGToken });

    const response: {
      success: boolean;
      txnHash?: string;
      error?: any;
    } = await fetch("/api/crystal-hub/withdraw-frg-crystal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    const { txnHash, error } = response;

    dispatch(setLoading(false));
    setConfirmWithdrawFRGCrystalDialog(false);

    if (error || !txnHash) {
      // This data should be from backend when server is up
      dispatch(setFrgCrystalBalance(prevFrgCrystalBalance));
      dispatch(setPendingFrgCrystalBalance(prevPendingFrgCrystalBalance));

      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    dispatch(setSuccess(`Running Transaction: ${txnHash}`));

    await checkTransactionStatus(txnHash);

    checkFRGBalance();
  };

  const withdrawFRGCrystalError = useMemo(() => {
    if (!account) return "Please connect your wallet";

    if (!selectedServer) return "Please select a server";

    if (!withdrawFRGCrystal) return "Please enter a value";

    if (
      !!frgCrystalBalance &&
      withdrawFRGCrystal &&
      withdrawFRGCrystal > frgCrystalBalance
    )
      return "You don't have that much FRG Crystal";

    if (withdrawFRGCrystal && withdrawFRGCrystal < minimum)
      return `Minimum withdrawal amount is ${minimum} FRG Crystal`;

    return null;
  }, [withdrawFRGCrystal, frgCrystalBalance, selectedServer, minimum, account]);

  return (
    <>
      <StyledCard variant="outlined">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "0.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TextField
              value={withdrawFRGCrystal}
              label="FRG Crystal"
              type="number"
              onChange={handleWithdrawFRGCrystalAmounts}
              InputLabelProps={{ shrink: true }}
              inputProps={{ sx: { color: WHITE, padding: "0.7rem" } }}
            />
            <ArrowRightAltIcon sx={{ marginBottom: "1rem" }} />
            <TextField
              value={withdrawFRGToken}
              label="$FRG"
              type="number"
              // disabled
              InputLabelProps={{ shrink: true }}
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  lineHeight: "1.25rem",
                  transformOrigin: "right",
                },
                "& legend": {
                  textAlign: "right",
                },
              }}
              inputProps={{ sx: { color: WHITE, padding: "0.7rem" } }}
            />
          </Box>
        </Box>
        {/* TODO: Sending of $FRG to wallet upon Mock Deposit */}
        <InteractButton
          text={t("crystal-hub:withdraw")}
          method={() => {
            setConfirmWithdrawFRGCrystalDialog(true);
          }}
          loading={loading}
          disabled={!!withdrawFRGCrystalError}
          variant="contained"
        />
        {!!withdrawFRGCrystalError && (
          <Typography variant="body2" sx={{ color: "red" }}>
            {withdrawFRGCrystalError}
          </Typography>
        )}
      </StyledCard>
      <BlackoutSpots />

      <Dialog
        open={confirmWithdrawFRGCrystalDialog}
        onClose={() => {
          setConfirmWithdrawFRGCrystalDialog(false);
        }}
      >
        {`确认将 ${withdrawFRGCrystal} FRG Crystal 提现到 ${withdrawFRGToken} $FRG 吗？ （$FRG
          将通过链上交易发送到您的绑定钱包`}
        <InteractButton
          text={t("crystal-hub:withdraw")}
          method={handleWithdrawFRGCrystal}
          loading={loading}
          variant="contained"
        />
        <InteractButton
          text="Cancel"
          method={() => {
            setConfirmWithdrawFRGCrystalDialog(false);
          }}
          loading={loading}
          variant="contained"
        />
      </Dialog>
    </>
  );
};

export default WithdrawFRGCrystal;
