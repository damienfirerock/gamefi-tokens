import React, { useState } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";

import useHasMounted from "../../utils/hooks/useHasMounted";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { NETWORKS_INFO_CONFIG } from "../../constants/networks";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled = false } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading || disabled}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const AirdropInformation: React.FunctionComponent = () => {
  const { t } = useTranslation("airdrop");
  const hasMounted = useHasMounted();
  const { chainId, library } = useWeb3React();

  if (!hasMounted) return null;

  return (
    <>
      <div className="Uniswap">
        <SwapWidget
          provider={library}
          jsonRpcUrlMap={{ [chainId!]: NETWORKS_INFO_CONFIG[chainId!].rpcUrl }}
        />
      </div>
    </>
  );
};

export default AirdropInformation;
