import React from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { Theme } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { CONTRACT_LIST, NETWORKS_INFO_CONFIG } from "../../constants/networks";

import { AppDispatch, RootState } from "../../store";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  PAPER_BACKGROUND,
  WHITE,
} from "../../src/theme";
import { setAccountDetailsOpen, setDialogOpen } from "../../features/AuthSlice";

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
  primary: WHITE,
  secondary: WHITE,
  interactive: PRIMARY_COLOR,
  container: PAPER_BACKGROUND,
  module: SECONDARY_COLOR,
  onInteractive: WHITE,
  accent: PRIMARY_COLOR,
  dialog: SECONDARY_COLOR,
  fontFamily: "Poppins",
};

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  margin: theme.spacing(2, 0),
}));

const AirdropInformation: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chainId, library } = useWeb3React();
  const { locale } = useRouter();
  const { data: session } = useSession();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { accountDetailsButtonRef } = authSlice;

  const handConnectWallet = () => {
    if (!session) {
      dispatch(setDialogOpen());
    } else {
      dispatch(setAccountDetailsOpen(accountDetailsButtonRef));
    }

    return false; // Prevents Uniswap's Default Connect Modal
  };

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
        theme={theme}
        hideConnectionUI
        onConnectWalletClick={handConnectWallet}
      />
    </StyledBox>
  );
};

export default AirdropInformation;
