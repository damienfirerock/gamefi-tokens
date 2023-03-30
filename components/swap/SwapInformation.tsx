import React from "react";
import { Box, BoxProps, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { Theme } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";

import useHasMounted from "../../utils/hooks/useHasMounted";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { CONTRACT_LIST, NETWORKS_INFO_CONFIG } from "../../constants/networks";

// Causes errors if not dynamic import
// Ref: https://github.com/Uniswap/widgets/issues/404
const SwapWidget = dynamic(
  async () => {
    const res = await import("@uniswap/widgets");
    return res.SwapWidget;
  },
  { ssr: false }
);

const theme: Theme = {
  primary: "#1F4A05",
  secondary: "#5F7D52",
  interactive: "#CBD6BA",
  container: "#D9ECD9",
  module: "#E9F7DF",
  accent: "#8E8B78",
  outline: "#CADDC2",
  dialog: "#FFF",
  fontFamily: "Comic Sans MS",
  borderRadius: { small: 0, medium: 0, large: 0 },
};

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
        {/* Note: Sequence Node does not work on Mumbai Testnet, unable to test swaps */}
        {/* Note: Keep @uniswap/widgets at 2.47.10 for now,
        2.48.0 onwards does not detect that transaction on wallet has been sent */}
        <SwapWidget
          provider={library}
          jsonRpcUrlMap={{
            [chainId!]: [NETWORKS_INFO_CONFIG[chainId!].rpcUrl],
          }}
          tokenList={NETWORKS_INFO_CONFIG[chainId!].tokenList}
          defaultInputTokenAddress={CONTRACT_LIST[chainId!].USDC_ADDRESS}
          defaultOutputTokenAddress={
            CONTRACT_LIST[chainId!].FIRE_ROCK_GOLD_ADDRESS
          }
          // Note: https://github.com/Uniswap/widgets/issues/465
          // Locale is currently not working
          locale="zh-CN"
        />

        <SwapWidget
          provider={library}
          jsonRpcUrlMap={{
            [chainId!]: [NETWORKS_INFO_CONFIG[chainId!].rpcUrl],
          }}
          tokenList={NETWORKS_INFO_CONFIG[chainId!].tokenList}
          defaultInputTokenAddress={CONTRACT_LIST[chainId!].USDC_ADDRESS}
          defaultOutputTokenAddress={
            CONTRACT_LIST[chainId!].FIRE_ROCK_GOLD_ADDRESS
          }
          theme={theme}
        />
      </div>
    </>
  );
};

export default AirdropInformation;
