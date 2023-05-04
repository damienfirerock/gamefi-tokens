import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";

import { AppDispatch, RootState } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";

const CrystalHub: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("crystal-hub");

  const { query } = useRouter();
  const { email, server, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session, loading } = authSlice;

  // TODO: Also need game server params, set server selection field below to server

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  useEffect(() => {
    if (!loading && !session && email && server && type) {
      handleOpenLoginDialog();
    }
  }, [email, server, type, session, loading]);

  return (
    <Layout>
      {/* Header */}
      <Typography variant="h3" sx={{ marginTop: 5, marginBottom: 2 }}>
        {t("crystal-hub:crystal-hub")}
      </Typography>

      {/* TODO: Show Address */}
      {/* TODO: Server Selection */}
      {/* TODO: Mock FRG Crystal Balance */}

      <Typography variant="h4" sx={{ marginTop: 5, marginBottom: 2 }}>
        {t("crystal-hub:deposit")}

        {/* TODO: Mock FRG Crystal to $FRG Exchange Rate */}
        {/* TODO: Fields for FRG Crystal Exchange */}
        {/* TODO: Sending of $FRG to wallet upon Mock Deposit */}
      </Typography>

      <Typography variant="h4" sx={{ marginTop: 5, marginBottom: 2 }}>
        {t("crystal-hub:withdraw")}
        {/* TODO: Mock $FRG to $FRG Crystal Exchange Rate */}
        {/* TODO: Fields for FRG Crystal Exchange */}
        {/* TODO: Sending of $FRG to company wallet, inducing listener to update mock FRG crystal value */}
      </Typography>
    </Layout>
  );
};

export default CrystalHub;
