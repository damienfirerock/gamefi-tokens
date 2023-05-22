import React from "react";
import { Box, BoxProps, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import Layout from "../layout/Layout";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";

import AccountDetails from "../main/GameAccountDetails";

const addresses = Object.values(CONTRACT_ADDRESSES);

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Main: React.FunctionComponent = () => {
  const { t } = useTranslation("common");

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
                variant="h6"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ADDRESS_NAMES[address]}:
              </Typography>
              <Typography variant="h6">
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
    </Layout>
  );
};

export default Main;
