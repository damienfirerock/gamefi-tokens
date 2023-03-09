import React, { useCallback } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isMobile } from "react-device-detect";

import ConnectWalletButton from "./common/ConnectWalletButton";

import useActivationWallet from "../../../utils/hooks/web3React/useActivationWallet";
import useDispatchErrors from "../../../utils/hooks/useDispatchErrors";
import { detectMetamask, WalletReadyState } from "../../../constants/wallets";
import {
  SUPPORTED_WALLET,
  SUPPORTED_WALLETS,
  WalletKeys,
} from "../../../constants/wallets";

// Issue: WalletConnect does not work with Sequence Wallet on Desktop
// (Should not be an issue since Sequence Wallet directly available)
// - Workaround: Don't show WalletConnect on Desktop
// (Does not seem necessary to show WalletConnect on Desktop anyway,
// It is required only for Metamask Connection on Mobile)

// Three Options: Sequence, Metamask, WalletConnect
// Sequence is recommended, so it is at the top
// Show Metamask option only if extension detected

// Therefore:
// Desktop: Show 1) Sequence, 2) Metamask
// Mobile: Show 1) Sequence, 2) Metamask* 3) WalletConnect
// * If provider is detected, which only happens in the rare scenario where user is accessing from Metamask mobile browser

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ConnectWalletButtons: React.FunctionComponent = () => {
  const { sendTransactionError } = useDispatchErrors();
  const { tryActivationEVM } = useActivationWallet();

  const handleConnectWallet = useCallback(
    async (walletKey: SUPPORTED_WALLET) => {
      try {
        const wallet = SUPPORTED_WALLETS[walletKey];
        await tryActivationEVM(wallet.connector);
      } catch (error) {
        sendTransactionError(JSON.stringify(error));
      }
    },
    []
  );

  const isMetamask = detectMetamask() === WalletReadyState.Installed;

  return (
    <>
      <StyledBox>
        <ConnectWalletButton
          handleClick={() => {
            handleConnectWallet(WalletKeys.Sequence);
          }}
          src={SUPPORTED_WALLETS[WalletKeys.Sequence].icon}
          text={`${SUPPORTED_WALLETS[WalletKeys.Sequence].name} (Recommended)`}
        />
      </StyledBox>
      {isMetamask && (
        <StyledBox>
          <ConnectWalletButton
            handleClick={() => {
              handleConnectWallet(WalletKeys.Metamask);
            }}
            src={SUPPORTED_WALLETS[WalletKeys.Metamask].icon}
            text={`${SUPPORTED_WALLETS[WalletKeys.Metamask].name}`}
          />
        </StyledBox>
      )}
      {isMobile && (
        <StyledBox>
          <ConnectWalletButton
            handleClick={() => {
              handleConnectWallet(WalletKeys.WalletConnect);
            }}
            src={SUPPORTED_WALLETS[WalletKeys.WalletConnect].icon}
            text={`${SUPPORTED_WALLETS[WalletKeys.WalletConnect].name}`}
          />
        </StyledBox>
      )}
    </>
  );
};

export default ConnectWalletButtons;
