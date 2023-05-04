import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardProps,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import Layout from "../layout/Layout";
import AccountButton from "../layout/buttons/AccountButton";
import InteractButton from "../common/InteractButton";

import { AppDispatch, RootState } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonTransactions";

const MOCK_SERVERS = ["海洋", "正式服1", "测试服1", "YH1", "SG", "A1"];
const MOCK_FRG_CRYSTAL_EXCHANGE_RATE = 10;
const MOCK_FRG_CRYSTAL_TAX_PERCENTAGE = 0.03;
const MOCK_FRG_CRYSTAL_WITHDRAWAL_MINIMUM = 1000;

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
}));

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useActiveWeb3React();
  const { checkWalletBalance } = useCommonWeb3Transactions();

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading } = authSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletBalance } = accountSlice;

  const [selectedServer, selectServer] = useState<string>("");
  const [mockCrystalBalance, setMockCrystalBalance] = useState<number>(99999);
  const [mockPendingCrystalBalance, setMockPendingCrystalBalance] =
    useState<number>(0);
  const [depositFRGCrystal, setDepositFRGCrystal] = useState<number>(0);
  const [depositFRGToken, setDepositFRGToken] = useState<number>(0);
  const [withdrawFRGCrystal, setWithdrawFRGCrystal] = useState<number>(0);
  const [withdrawFRGToken, setWithdrawFRGToken] = useState<number>(0);

  const handleSelectServer = (event: SelectChangeEvent) => {
    selectServer(event.target.value as string);
  };

  const handleDepositFRGTokenAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTokenValue = Number(event.target.value);
    setDepositFRGToken(nextTokenValue);

    const nextCrystalValue = nextTokenValue * MOCK_FRG_CRYSTAL_EXCHANGE_RATE;
    setDepositFRGCrystal(nextCrystalValue);
  };

  const handleWithdrawFRGCrystalAmounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextCrystalValue = Number(event.target.value);
    setWithdrawFRGCrystal(nextCrystalValue);

    const nextTokenValue =
      (nextCrystalValue / MOCK_FRG_CRYSTAL_EXCHANGE_RATE) *
      (1 - MOCK_FRG_CRYSTAL_TAX_PERCENTAGE);
    setWithdrawFRGToken(nextTokenValue);
  };

  useEffect(() => {
    const handleOpenLoginDialog = () => {
      dispatch(setDialogOpen());
    };

    // In the event of re-direct from game client
    if (!loading && !session && email && type) {
      handleOpenLoginDialog();
    }
  }, [email, type, session, loading]);

  useEffect(() => {
    if (!!server) {
      selectServer(server.toString());
    }
  }, [server]);

  useEffect(() => {
    if (!!account) {
      checkWalletBalance();
    }
  }, [account]);

  const withdrawFRGCrystalError = useMemo(() => {
    if (!selectedServer) return "Please select a server";

    if (withdrawFRGCrystal > mockCrystalBalance)
      return "You don't have that much FRG Crystal";

    if (withdrawFRGCrystal < MOCK_FRG_CRYSTAL_WITHDRAWAL_MINIMUM)
      return `Minimum withdrawal amount is ${MOCK_FRG_CRYSTAL_WITHDRAWAL_MINIMUM} FRG Crystal`;

    return null;
  }, [withdrawFRGCrystal, mockCrystalBalance, selectedServer]);

  const depositFRGTokenError = useMemo(() => {
    if (!selectedServer) return "Please select a server";

    if (!walletBalance || depositFRGToken > walletBalance)
      return "You don't have that much $FRG";

    return null;
  }, [depositFRGToken, walletBalance, selectedServer]);

  return (
    <Layout>
      {/* Header */}
      <Typography variant="h3" sx={{ marginTop: 5 }}>
        {t("crystal-hub:crystal-hub")}
      </Typography>

      {session && !account && <AccountButton />}
      {/* TODO: Eventually will need to check against account bound wallet */}
      {!!account && <Typography variant="h4">Wallet: {account}</Typography>}
      {!!walletBalance && (
        <Typography variant="h4">$FRG: {walletBalance}</Typography>
      )}

      {/* Server Selection */}
      <Box sx={{ marginY: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Server</InputLabel>
          <Select
            value={selectedServer}
            label="Server"
            onChange={handleSelectServer}
          >
            {MOCK_SERVERS.map((server) => (
              <MenuItem key={server} value={server}>
                {server}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5">
        Mock FRG Crystal Balance: {mockCrystalBalance}
      </Typography>
      <Typography variant="h5">
        Mock Pending FRG Crystal Balance: {mockPendingCrystalBalance}
      </Typography>

      <StyledCard variant="outlined">
        <StyledCard variant="outlined">
          <Typography variant="h4">{t("crystal-hub:withdraw")}</Typography>
          <Typography variant="h5">
            Mock FRG Crystal to $FRG Exchange Rate:{" "}
            {MOCK_FRG_CRYSTAL_EXCHANGE_RATE}:1
          </Typography>
          <Typography variant="h5">
            Mock FRG Crystal Exchange Tax Rate:{" "}
            {MOCK_FRG_CRYSTAL_TAX_PERCENTAGE * 100}%
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
                label="$FRG"
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          {/* TODO: Sending of $FRG to wallet upon Mock Deposit */}
          <InteractButton
            text={t("crystal-hub:withdraw")}
            method={() => null}
            loading={loading}
            disabled={!!withdrawFRGCrystalError}
          />
          {!!withdrawFRGCrystalError && (
            <Typography variant="h6" sx={{ color: "red" }}>
              {withdrawFRGCrystalError}
            </Typography>
          )}
        </StyledCard>

        <StyledCard variant="outlined">
          <Typography variant="h4">{t("crystal-hub:deposit")} </Typography>
          <Typography variant="h5">
            Mock $FRG to FRG Crystal Exchange Rate: 1:
            {MOCK_FRG_CRYSTAL_EXCHANGE_RATE}
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
                value={depositFRGToken}
                label="$FRG"
                onChange={handleDepositFRGTokenAmounts}
              />
              <ArrowRightAltIcon />
              <TextField
                value={depositFRGCrystal}
                label="FRG Crystal"
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          {/* TODO: Sending of $FRG to company wallet, inducing listener to update mock FRG crystal value */}
          <InteractButton
            text={t("crystal-hub:deposit")}
            method={() => null}
            loading={loading}
            disabled={!!depositFRGTokenError}
          />
          {!!depositFRGTokenError && (
            <Typography variant="h6" sx={{ color: "red" }}>
              {depositFRGTokenError}
            </Typography>
          )}
        </StyledCard>
      </StyledCard>
    </Layout>
  );
};

export default CrystalHub;
