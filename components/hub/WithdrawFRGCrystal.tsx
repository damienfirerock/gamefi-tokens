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

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
}));

const WithdrawFRGCrystal: React.FunctionComponent<{
  selectedServer: string;
}> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useWeb3React();
  const { checkWalletBalance, checkTransactionStatus } =
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

  const [withdrawFRGCrystal, setWithdrawFRGCrystal] = useState<number>(0);
  const [withdrawFRGToken, setWithdrawFRGToken] = useState<number>(0);
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
    const nextWithdrawFRGCrystal = withdrawFRGCrystal;

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

    checkWalletBalance();
  };

  const withdrawFRGCrystalError = useMemo(() => {
    if (!selectedServer) return "Please select a server";

    if (!!frgCrystalBalance && withdrawFRGCrystal > frgCrystalBalance)
      return "You don't have that much FRG Crystal";

    if (withdrawFRGCrystal < minimum)
      return `Minimum withdrawal amount is ${minimum} FRG Crystal`;

    return null;
  }, [withdrawFRGCrystal, frgCrystalBalance, selectedServer, minimum]);

  return (
    <>
      <StyledCard variant="outlined">
        <Typography variant="h6">{t("crystal-hub:withdraw")}</Typography>
        <Typography variant="h6">
          Mock FRG Crystal to $FRG Exchange Rate - {rate}:1
        </Typography>
        <Typography variant="h6">
          Mock FRG Crystal Exchange Tax Rate: {tax}%
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginY: 2,
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
              onChange={handleWithdrawFRGCrystalAmounts}
            />
            <ArrowRightAltIcon />
            <TextField
              value={withdrawFRGToken}
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">$FRG</InputAdornment>
                ),
              }}
              // FIXME: Unable to change color from before and from createTheme
              // sx={{ input: { color: "#FFFFFF !important" } }}
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
          <Typography variant="h6" sx={{ color: "red" }}>
            {withdrawFRGCrystalError}
          </Typography>
        )}
      </StyledCard>

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
