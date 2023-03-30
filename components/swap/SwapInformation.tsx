import React from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { Theme } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useRouter } from "next/router";

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
  primary: "#FFF",
  secondary: "#A9A9A9",
  interactive: "#000",
  container: "#4E4E5A",
  module: "#222633",
  accent: "#71FF98",
  outline: "#CC1",
  dialog: "#000",
  fontFamily: "Josefin Sans",
  borderRadius: { small: 1, medium: 1, large: 1 },
};

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  margin: theme.spacing(2, 0),
}));

const AirdropInformation: React.FunctionComponent = () => {
  const { chainId, library } = useWeb3React();
  const { locale } = useRouter();

  return (
    <StyledBox>
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
        locale={locale === "zh" ? "zh-CN" : "en-GB"}
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
    </StyledBox>
  );
};

export default AirdropInformation;
