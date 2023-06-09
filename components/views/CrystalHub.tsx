import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, CardProps, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

import Layout from "../layout/Layout";
import WithdrawFRGCrystal from "../hub/WithdrawFRGCrystal";
import DepositFRGToken from "../hub/DepositFRGToken";
import ExchangeInfo from "../hub/ExchangeInfo";
import HubWalletDetails from "../hub/HubWalletDetails";
import ServerSelection from "../hub/ServerSelection";
import CrystalDetails from "../hub/CrystalDetails";
import CrystalTransactions from "../hub/CrystalTransactions";

import { AppDispatch, RootState } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";
import { setSuccess, clearSuccess } from "../../features/TransactionSlice";
import {
  setFrgCrystalBalance,
  setPendingFrgCrystalBalance,
} from "../../features/AccountSlice";
const FireRockGoldJson = require("../../constants/abis/FireRockGold.json");

const StyledCard = styled(Card)<CardProps>(() => ({
  marginBottom: "1rem",
  borderRadius: "0.5rem",
  border: 0,
}));

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading: authLoading } = authSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { frgCrystalBalance } = accountSlice;

  const hubSlice = useSelector((state: RootState) => state.hub);
  const { data } = hubSlice;
  const { rate } = data!;

  // Simpler to use state to share selectedServer,
  // Rather than handle yup and conditional schemas
  const [selectedServer, selectServer] = useState<string>("");
  const [transaction, setTransaction] = useState<{
    transactionType: string;
    hash: string;
    amount: string;
    status: string;
    createdAt: string;
  } | null>({
    amount: "119.69800000000001",
    createdAt: "Fri Jun 09 2023",
    hash: "0x535cc12efc4b5b6456b9ade4db11e2e68b261b4e3a1cf2542a87455b494c174d",
    status: "Pending",
    transactionType: "Withdraw FRG Crystal",
  });

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
            `Testing Confirmations: [${receipt.confirmations}/${confirmationsNeeded}]`
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

        setTransaction({
          transactionType:
            to === "0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f"
              ? "Deposit $FRG"
              : "Withdraw FRG Crystal",
          hash: event.transactionHash,
          amount: nextValue,
          status: "Pending",
          createdAt: dayjs(new Date()).format("DD MMM YY"),
        });

        await waitForConfirmations(event.transactionHash, 10);
        dispatch(
          setSuccess(
            `Confirmed: Transfer of ${nextValue} $FRG from ${from} to ${to} `
          )
        );

        if (to === "0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f") {
          dispatch(
            setFrgCrystalBalance(
              frgCrystalBalance! + parseInt(nextValue) * rate
            )
          );
        }

        dispatch(setPendingFrgCrystalBalance(0));

        setTransaction((prevState) => {
          if (!prevState) return null;
          return { ...prevState, status: "Success" };
        });
      });
    };

    subscribeToTransferEvents();

    return () => {
      tokenContract.removeAllListeners("Transfer");
      dispatch(clearSuccess()); // Clear any unclosed success messages so they won't re-appear on navigation
    };
  }, [frgCrystalBalance, rate]);

  return (
    <Layout>
      <Container maxWidth="sm">
        <HubWalletDetails />

        <ServerSelection
          selectedServer={selectedServer}
          handleSelectServer={handleSelectServer}
        />

        <CrystalDetails />

        <StyledCard variant="outlined">
          <ExchangeInfo />
          <WithdrawFRGCrystal selectedServer={selectedServer} />
          <DepositFRGToken selectedServer={selectedServer} />
        </StyledCard>

        <CrystalTransactions transaction={transaction} />
      </Container>
    </Layout>
  );
};

export default CrystalHub;
