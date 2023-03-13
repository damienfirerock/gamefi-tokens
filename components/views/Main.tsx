import React from "react";
import { Box, BoxProps, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import { AppDispatch, RootState } from "../../store";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearAirdropError } from "../../features/AirdropSlice";
import AccountDetails from "../main/AccountDetails";

const addresses = Object.values(CONTRACT_ADDRESSES);

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Main: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common");

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { error: airdropError } = airdropSlice;

  const handleClearAlert = () => {
    if (airdropError) {
      dispatch(clearAirdropError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Layout>
      {/* Header */}
      <AccountDetails />
      <ContractsBox>
        <Typography variant="h3">{t("addresses")}</Typography>
        {addresses.map((address) => {
          if (!address) return;
          return (
            <Box
              key={address}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginY: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ADDRESS_NAMES[address]}:
              </Typography>
              <Typography variant="h4">
                <Link
                  href={`${CONFIG.POLYGONSCAN_URL}${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {address}
                </Link>
              </Typography>
            </Box>
          );
        })}
      </ContractsBox>

      <AlertBar
        severity="warning"
        text={error || airdropError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default Main;
