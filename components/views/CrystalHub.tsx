import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Alert,
  Box,
  Card,
  CardProps,
  Container,
  FormControl,
  InputBase,
  InputBaseProps,
  InputLabel,
  Link,
  MenuItem,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";

import { AppDispatch, RootState } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { setSuccess, clearSuccess } from "../../features/TransactionSlice";
import WithdrawFRGCrystal from "../hub/WithdrawFRGCrystal";
import DepositFRGToken from "../hub/DepositFRGToken";
import { getEtherscanLink } from "../../utils/web3";
import { truncateString, formatNumberValue } from "../../utils/common";
import {
  setFrgCrystalBalance,
  setPendingFrgCrystalBalance,
} from "../../features/AccountSlice";
import { PAPER_BACKGROUND, PRIMARY_COLOR, WHITE } from "../../src/theme";
const FireRockGoldJson = require("../../constants/abis/FireRockGold.json");

const VALUE_COLOUR = "#FE5218";
const SELECTED_COLOUR = "#413D55";

const MOCK_SERVERS = ["海洋", "正式服1", "测试服1", "YH1", "SG", "A1"];

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  marginBottom: "1rem",
}));

const StyledInputBase = styled(InputBase)<InputBaseProps>(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    color: WHITE,
    backgroundColor: PAPER_BACKGROUND,
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",
    borderRadius: "0.5rem",
    "&:focus": {
      backgroundColor: PAPER_BACKGROUND,
      borderRadius: "0.5rem",
    },
  },
}));

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useWeb3React();

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading: authLoading } = authSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletFRGBalance, frgCrystalBalance, pendingFrgCrystalBalance } =
    accountSlice;

  const hubSlice = useSelector((state: RootState) => state.hub);
  const { data } = hubSlice;
  const { rate } = data!;

  const [selectedServer, selectServer] = useState<string>("");
  const [transaction, setTransaction] = useState<{
    transactionType: string;
    hash: string;
    amount: string;
    status: string;
    createdAt: string;
  } | null>(null);

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

        setTransaction({
          transactionType:
            to === "0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f"
              ? "Deposit $FRG"
              : "Withdraw FRG Crystal",
          hash: event.transactionHash,
          amount: nextValue,
          status: "Pending",
          createdAt: new Date().toDateString(),
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
      <Container maxWidth="md">
        {/* TODO: Eventually will need to check against account bound wallet from server account details */}
        {!!account && (
          <Typography variant="body2" color="primary">
            Wallet: {account}
          </Typography>
        )}
        {!!walletFRGBalance && (
          <Typography variant="body2">
            $FRG: {formatNumberValue(walletFRGBalance)}
          </Typography>
        )}

        {/* Server Selection */}
        <Box sx={{ marginY: 2 }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel
              sx={{
                color: `${WHITE} !important`,
              }}
              shrink={true}
            >
              Server
            </InputLabel>
            <Select
              value={selectedServer}
              label="Server"
              onChange={handleSelectServer}
              notched={true}
              input={<StyledInputBase />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiMenuItem-root": {
                      "&:active": {
                        bgcolor: SELECTED_COLOUR,
                      },
                      "&:focus": {
                        bgcolor: SELECTED_COLOUR,
                      },
                    },
                    "& .Mui-selected": {
                      bgcolor: SELECTED_COLOUR,
                    },
                  },
                },
              }}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: WHITE,
                },
              }}
            >
              {MOCK_SERVERS.map((server) => (
                <MenuItem key={server} value={server}>
                  {server}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="body2">
            Mock FRG Crystal Balance:{" "}
            <Box component="span" sx={{ color: VALUE_COLOUR }}>
              {frgCrystalBalance}
            </Box>
          </Typography>
          <Typography variant="body2">
            Mock Pending FRG Crystal Balance:{" "}
            <Box component="span" sx={{ color: VALUE_COLOUR }}>
              {pendingFrgCrystalBalance}
            </Box>
          </Typography>
        </Box>

        <StyledCard variant="outlined">
          <WithdrawFRGCrystal selectedServer={selectedServer} />
          <DepositFRGToken selectedServer={selectedServer} />
        </StyledCard>

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
      </Container>
    </Layout>
  );
};

export default CrystalHub;
