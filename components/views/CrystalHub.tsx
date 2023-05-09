import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Card,
  CardProps,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import AccountButton from "../layout/buttons/AccountButton";

import { AppDispatch, RootState } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonWeb3Transactions";
import { setSuccess } from "../../features/TransactionSlice";
import WithdrawFRGCrystal from "../hub/WithdrawFRGCrystal";
import DepositFRGToken from "../hub/DepositFRGToken";

const FireRockGoldJson = require("../../constants/abis/FireRockGold.json");

const MOCK_SERVERS = ["海洋", "正式服1", "测试服1", "YH1", "SG", "A1"];

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
}));

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useWeb3React();
  const { checkWalletBalance } = useCommonWeb3Transactions();

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading: authLoading } = authSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletBalance, frgCrystalBalance, pendingFrgCrystalBalance } =
    accountSlice;

  const [selectedServer, selectServer] = useState<string>("");

  const handleSelectServer = (event: SelectChangeEvent) => {
    selectServer(event.target.value as string);
  };

  useEffect(() => {
    const handleOpenLoginDialog = () => {
      dispatch(setDialogOpen());
    };

    // In the event of re-direct from game client
    if (!authLoading && !session && email && type) {
      handleOpenLoginDialog();
    }
  }, [email, type, session, authLoading]);

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

  useEffect(() => {
    const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
      process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;
    const NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER =
      process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER;

    const provider = new ethers.providers.JsonRpcProvider(
      NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER
    );
    const tokenContract = new ethers.Contract(
      NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS!,
      FireRockGoldJson.abi,
      provider
    );

    const waitForConfirmations = async (
      txHash: string,
      confirmationsNeeded: number
    ) => {
      let receipt = await provider.getTransactionReceipt(txHash);
      while (receipt === null || receipt.confirmations < confirmationsNeeded) {
        dispatch(
          setSuccess(
            `Waiting 5 more seconds for Txn: ${txHash} as confirmations currently at [${receipt.confirmations}/${confirmationsNeeded}]`
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
        receipt = await provider.getTransactionReceipt(txHash);
      }
      return receipt.confirmations;
    };

    const subscribeToTransferEvents = async () => {
      tokenContract.on("Transfer", async (from, to, value, event) => {
        const nextValue = ethers.utils.formatUnits(value, 18);
        await waitForConfirmations(event.transactionHash, 10);
        dispatch(
          setSuccess(
            `Confirmed: Transfer of ${nextValue} $FRG from ${from} to ${to} `
          )
        );
      });

      return () => {
        tokenContract.removeAllListeners("Transfer");
      };
    };

    subscribeToTransferEvents();
  }, []);

  return (
    <Layout>
      <Typography variant="h3" sx={{ marginTop: 5 }}>
        {t("crystal-hub:crystal-hub")}
      </Typography>

      {session && !account && <AccountButton />}
      {/* TODO: Eventually will need to check against account bound wallet from server account details */}
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
        Mock FRG Crystal Balance: {frgCrystalBalance}
      </Typography>
      <Typography variant="h5">
        Mock Pending FRG Crystal Balance: {pendingFrgCrystalBalance}
      </Typography>

      <StyledCard variant="outlined">
        <WithdrawFRGCrystal selectedServer={selectedServer} />
        <DepositFRGToken selectedServer={selectedServer} />
      </StyledCard>
    </Layout>
  );
};

export default CrystalHub;
