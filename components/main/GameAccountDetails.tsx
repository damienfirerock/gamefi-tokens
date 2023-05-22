import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import { AppDispatch, RootState } from "../../store";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { setLoading } from "../../features/TransactionSlice";

import { NETWORKS_INFO_CONFIG } from "../../constants/networks";
import { NAV_TEXT_COLOUR } from "../../src/theme";

const GameAccountDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["common", "airdrop"]);

  const { account, chainId } = useWeb3React();

  const setupInitial = async () => {
    dispatch(setLoading(true));

    // await checkWalletBalance();

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (account) {
      setupInitial();
    }
  }, [account]);

  return (
    <>
      {account && (
        <>
          <Typography variant="h6">{t("common:account-details")}</Typography>
          <Box
            sx={{
              boxShadow: "0px 0px 20px 0.5px #d3d3d3",
              background: "white",
              marginY: "1rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              color: NAV_TEXT_COLOUR,
            }}
            // elevation={6}
          >
            <Typography variant="body1">
              {t("common:address")}: {account}
            </Typography>
            <Typography variant="body1">
              {t("common:address")}: {account}
            </Typography>
            <Typography variant="body1">
              {t("common:address")}: {account}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default GameAccountDetails;
