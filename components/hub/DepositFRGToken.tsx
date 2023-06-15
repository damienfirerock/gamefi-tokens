import React, { useState, useMemo } from "react";
import { ethers } from "ethers";
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

import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../features/TransactionSlice";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonWeb3Transactions";
import { setSuccess } from "../../features/TransactionSlice";
import { setPendingFrgCrystalBalance } from "../../features/AccountSlice";
import CONFIG from "../../config";
import { LIGHT_GRAY, PRIMARY_COLOR, WHITE } from "../../src/theme";

const { FIRE_ROCK_TOKEN } = CONFIG;

const FireRockGoldJson = require("../../constants/abis/FireRockGold.json");

const MOCK_FRG_CRYSTAL_EXCHANGE_RATE = 10;

export const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: "0.5rem 0.75rem 1.25rem 0.75rem",
}));

const DepositFRGToken: React.FunctionComponent<{
  selectedServer: string;
}> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account, library } = useWeb3React();
  const { checkFRGBalance, checkTransactionStatus } =
    useCommonWeb3Transactions();
  const { selectedServer } = props;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session } = authSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletFRGBalance } = accountSlice;

  const hubSlice = useSelector((state: RootState) => state.hub);
  const { data } = hubSlice;
  const { rate } = data!;

  const [depositFRGToken, setDepositFRGToken] = useState<number | null>(null);
  const [depositFRGCrystal, setDepositFRGCrystal] = useState<number | null>(
    null
  );
  const [confirmDepositFRGTokenDialog, setConfirmDepositFRGTokenDialog] =
    useState<boolean>(false);

  const handleDepositFRGCrystalToTokenAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTokenValue = Number(event.target.value);
    setDepositFRGToken(nextTokenValue);

    const nextCrystalValue = nextTokenValue * MOCK_FRG_CRYSTAL_EXCHANGE_RATE;
    setDepositFRGCrystal(nextCrystalValue);
  };

  const handleDepositFRGTokenToCrystalAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextCrystalValue = Number(event.target.value);
    setDepositFRGCrystal(nextCrystalValue);

    const nextTokenValue = nextCrystalValue / MOCK_FRG_CRYSTAL_EXCHANGE_RATE;
    setDepositFRGToken(nextTokenValue);
  };

  const handleDepositFRGToken = async () => {
    dispatch(setLoading(true));
    const nextDepositFRGToken = depositFRGToken;
    dispatch(setPendingFrgCrystalBalance(nextDepositFRGToken! * rate));
    const signer = library!.getSigner(account!);

    const fireRockGoldContract = new ethers.Contract(
      FIRE_ROCK_TOKEN!,
      FireRockGoldJson.abi,
      signer
    );

    const decimals = await fireRockGoldContract.decimals();
    const value = await ethers.utils.parseUnits(
      depositFRGToken!.toString(),
      decimals
    );

    const tx = await fireRockGoldContract.transfer(
      "0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f",
      value
    );
    const { hash } = tx;

    // TODO: Error Handling

    setConfirmDepositFRGTokenDialog(false);

    dispatch(setSuccess(`Running Transaction: ${hash}`));

    dispatch(setLoading(false));

    await checkTransactionStatus(hash);

    // TODO: Once backend up, should check for account frgCrystal value again

    checkFRGBalance();
  };

  const depositFRGTokenError = useMemo(() => {
    if (!session) return t("errors.login");

    if (!account) return t("errors.wallet");

    if (!selectedServer) return t("errors.server");

    if (!depositFRGToken) return " ";

    if (
      !walletFRGBalance ||
      (depositFRGToken && depositFRGToken > walletFRGBalance)
    )
      return t("errors.insufficient-tokens");

    return null;
  }, [depositFRGToken, walletFRGBalance, selectedServer, account, session]);

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
              value={depositFRGToken || ""}
              InputLabelProps={{ shrink: true }}
              label="$FRG"
              type="number"
              onChange={handleDepositFRGCrystalToTokenAmounts}
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
              value={depositFRGCrystal || ""}
              label={`FRG ${t("crystal")}`}
              type="number"
              onChange={handleDepositFRGTokenToCrystalAmounts}
              InputLabelProps={{
                shrink: true,
              }}
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
              inputProps={{
                sx: {
                  color: WHITE,
                  padding: "0.7rem",
                },
              }}
            />
          </Box>
        </Box>
        {/* TODO: Sending of $FRG to company wallet, inducing listener to update mock FRG crystal value */}
        <InteractButton
          text={t("crystal-hub:deposit")}
          method={() => {
            setConfirmDepositFRGTokenDialog(true);
          }}
          loading={loading}
          disabled={!!depositFRGTokenError}
          variant="contained"
          fullWidth
        />
        {!!depositFRGTokenError && (
          <Typography variant="caption" sx={{ display: "block", color: "red" }}>
            {depositFRGTokenError}
          </Typography>
        )}
      </StyledBox>

      <Dialog
        open={confirmDepositFRGTokenDialog}
        onClose={() => {
          setConfirmDepositFRGTokenDialog(false);
        }}
        maxWidth="xs"
      >
        {" "}
        <DialogTitle>Deposit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`$FRG 将从您的钱包发送到官方游戏钱包：0x1234FIREROCK1234。
如果 0x1234FIREROCK1234 不是交易的目标地址，请不要确认钱包交易。
一旦您的转账被确认，我们将自动更新您的游戏帐户中的 FRG Crystal 余额.`}{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <InteractButton
            text={t("crystal-hub:deposit")}
            method={handleDepositFRGToken}
            loading={loading}
            variant="contained"
          />
          <InteractButton
            text="Cancel"
            method={() => {
              setConfirmDepositFRGTokenDialog(false);
            }}
            loading={loading}
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepositFRGToken;
