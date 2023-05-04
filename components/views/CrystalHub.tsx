import React, { useEffect, useState } from "react";
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
import useActiveWeb3React from "../../utils/hooks/web3React/useActiveWeb3React";

const MOCK_SERVERS = ["海洋", "正式服1", "测试服1", "YH1", "SG", "A1"];

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
}));

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");
  const { account } = useActiveWeb3React();

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading } = authSlice;

  const [selectedServer, selectServer] = useState<string>("");
  const [mockCrystalBalance, setMockCrystalBalance] = useState<number>(0);
  const [mockPendingCrystalBalance, setMockPendingCrystalBalance] =
    useState<number>(0);

  const handleSelectServer = (event: SelectChangeEvent) => {
    selectServer(event.target.value as string);
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

  return (
    <Layout>
      {/* Header */}
      <Typography variant="h3" sx={{ marginTop: 5 }}>
        {t("crystal-hub:crystal-hub")}
      </Typography>

      {session && !account && <AccountButton />}
      {/* TODO: Eventually will need to check against account bound wallet */}
      {!!account && <Typography variant="h4">Wallet: {account}</Typography>}

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

      {/* TODO: Mock FRG Crystal Balance */}

      <StyledCard variant="outlined">
        <StyledCard variant="outlined">
          <Typography variant="h4">
            {t("crystal-hub:deposit")}
            {/* TODO: Mock FRG Crystal to $FRG Exchange Rate */}
            {/* TODO: Fields for FRG Crystal Exchange */}
            {/* TODO: Sending of $FRG to wallet upon Mock Deposit */}
          </Typography>
        </StyledCard>

        <StyledCard variant="outlined">
          <Typography variant="h4">
            {t("crystal-hub:withdraw")}
            {/* TODO: Mock $FRG to $FRG Crystal Exchange Rate */}
            {/* TODO: Fields for FRG Crystal Exchange */}
            {/* TODO: Sending of $FRG to company wallet, inducing listener to update mock FRG crystal value */}
          </Typography>
        </StyledCard>
      </StyledCard>
    </Layout>
  );
};

export default CrystalHub;
