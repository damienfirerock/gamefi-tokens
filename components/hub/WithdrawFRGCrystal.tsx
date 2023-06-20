import React, { useState, useMemo } from "react";
import {
  Box,
  BoxProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { DISABLED_COLOUR, LIGHT_GRAY, WHITE } from "../../src/theme";

export const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: "0.5rem 0.75rem 1.25rem 0.75rem",
  borderBottom: `1px dashed ${DISABLED_COLOUR}`,
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

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session } = authSlice;

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

  const handleWithdrawFRGCrystalToTokenAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextCrystalValue = Number(event.target.value);
    setWithdrawFRGCrystal(nextCrystalValue);
    const nextTokenValue = (nextCrystalValue / rate) * (1 - tax / 100);
    setWithdrawFRGToken(nextTokenValue);
  };

  const handleWithdrawFRGTokenToCrystalAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTokenValue = Number(event.target.value);
    setWithdrawFRGToken(nextTokenValue);

    const nextCrystalValue = (nextTokenValue * rate) / (1 - tax / 100);
    setWithdrawFRGCrystal(nextCrystalValue);
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
    if (!session) return t("errors.login");

    if (!account) return t("errors.wallet");

    if (!selectedServer) return t("errors.server");

    if (!withdrawFRGCrystal) return " ";

    if (
      !!frgCrystalBalance &&
      withdrawFRGCrystal &&
      withdrawFRGCrystal > frgCrystalBalance
    )
      return t("errors.insufficient-crystals");

    if (withdrawFRGCrystal && withdrawFRGCrystal < minimum)
      return t("errors.minimum-withdrawal", { minimum: minimum });

    return null;
  }, [
    t,
    withdrawFRGCrystal,
    frgCrystalBalance,
    selectedServer,
    minimum,
    account,
    session,
  ]);

  return (
    <>
      <StyledBox>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "0.75rem",
            marginBottom: "0.25rem",
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
              value={withdrawFRGCrystal || ""}
              label={`FRG ${t("crystal")}`}
              type="number"
              onChange={handleWithdrawFRGCrystalToTokenAmounts}
              InputLabelProps={{ shrink: true }}
              inputProps={{ sx: { color: WHITE, padding: "0.7rem" } }}
              sx={{
                "& label": {
                  color: LIGHT_GRAY,
                },
                fieldset: { borderColor: LIGHT_GRAY },
              }}
            />
            <ArrowRightAltIcon
              sx={{ marginBottom: "1rem", fill: LIGHT_GRAY }}
            />
            <TextField
              value={withdrawFRGToken || ""}
              label="$FRG"
              type="number"
              onChange={handleWithdrawFRGTokenToCrystalAmounts}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  lineHeight: "1.25rem",
                  transformOrigin: "right",
                  color: LIGHT_GRAY,
                },
                "& legend": {
                  textAlign: "right",
                },
                fieldset: { borderColor: LIGHT_GRAY },
              }}
              inputProps={{ sx: { color: WHITE, padding: "0.7rem" } }}
            />
          </Box>
        </Box>

        <InteractButton
          text={t("crystal-hub:withdraw")}
          method={() => {
            setConfirmWithdrawFRGCrystalDialog(true);
          }}
          loading={loading}
          disabled={!!withdrawFRGCrystalError}
          variant="contained"
          fullWidth
        />
        {!!withdrawFRGCrystalError && (
          <Typography variant="caption" sx={{ display: "block", color: "red" }}>
            {withdrawFRGCrystalError}
          </Typography>
        )}
      </StyledBox>
      <BlackoutSpots />

      <Dialog
        open={confirmWithdrawFRGCrystalDialog}
        onClose={() => {
          setConfirmWithdrawFRGCrystalDialog(false);
        }}
        maxWidth="xs"
      >
        <DialogTitle>Withdraw</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`确认将 ${withdrawFRGCrystal} FRG Crystal 提现到 ${withdrawFRGToken} $FRG 吗？ （$FRG
          将通过链上交易发送到您的绑定钱包`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawFRGCrystal;
