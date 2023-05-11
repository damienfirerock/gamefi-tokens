import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import { AppDispatch, RootState } from "../../store";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { setLoading } from "../../features/TransactionSlice";

import { NETWORKS_INFO_CONFIG } from "../../constants/networks";

const AccountDetails: React.FunctionComponent = () => {
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
          <Typography variant="h3" sx={{ marginTop: 5, marginBottom: 2 }}>
            {t("common:account-details")}
          </Typography>
          <Typography variant="h6">
            {t("common:address")}: {account}
          </Typography>
          <Typography variant="h6">
            {t("common:network")}:{" "}
            {!!chainId ? NETWORKS_INFO_CONFIG[chainId].name : "unknown"}
          </Typography>
          {/* <Typography variant="h6">
            $FRG {t("airdrop:balance")}: {walletBalance}
          </Typography> */}
        </>
      )}
    </>
  );
};

export default AccountDetails;
