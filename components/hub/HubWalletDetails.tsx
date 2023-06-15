import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import { RootState } from "../../store";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { getEtherscanLink } from "../../utils/web3";
import { truncateString, formatNumberValue } from "../../utils/common";
import { VALUE_COLOUR } from "../../src/theme";

const HubWalletDetails: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { t } = useTranslation(["crystal-hub", "account"]);

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletFRGBalance } = accountSlice;

  return (
    <>
      {!!account && (
        <>
          <Typography
            variant="caption"
            color="primary"
            sx={{ display: "block", marginTop: "0.5rem" }}
          >
            {t("crystal-hub:wallet")}:{" "}
            <Link
              href={getEtherscanLink(account, "address")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateString(account, 6)}
            </Link>
          </Typography>
          {!!walletFRGBalance && (
            <Typography variant="caption" sx={{ display: "block" }}>
              $FRG:{" "}
              <Box component="span" sx={{ color: VALUE_COLOUR }}>
                {formatNumberValue(walletFRGBalance)}
              </Box>
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{ color: "red", display: "inline-block" }}
          >
            {t("account:wallet-different-from-bound")}
          </Typography>
        </>
      )}
    </>
  );
};

export default HubWalletDetails;
