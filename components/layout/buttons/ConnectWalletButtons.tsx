import React, { useCallback } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isMobile } from "react-device-detect";

import ConnectWalletButton from "./common/ConnectWalletButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import useActivationWallet from "../../../utils/hooks/web3React/useActivationWallet";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useDispatchErrors from "../../../utils/hooks/useDispatchErrors";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
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

//   if (chainId !== parseInt(CONFIG.NETWORK_CHAIN_ID || "80001"))
//     return (
//       <ConnectWalletButton
//         handleClick={requestChangeChainId}
//         text={`Change to ${nextNetwork()}`}
//       />
//     );

// FIXME: Connecting with Metamask does not update account in useActiveWeb3Wallet()
// TODO: Update useAirdropTransactions
// TODO: Add useSignTransactions for signatures between Sequence versus Metamask for binding of wallets
// TODO: Hide WalletConnect on Desktop
// TODO: Show Metamask only with provider on Mobile

// Connects to Metamask on Desktop
// Connects to Sequence on Desktop

// Connects to Metamask via WalletConnect on Mobile
// Connects to Sequence on Mobile
// Connects to Metamask via Metamask Browser on Mobile

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ConnectWalletButtons: React.FunctionComponent = () => {
  const { sendTransactionError } = useDispatchErrors();

  const { active, connector, error, deactivate } = useWeb3React();
  const { tryActivationEVM } = useActivationWallet();
  const { account, walletKey } = useActiveWeb3React();
  const {
    account: originalAccount,
    chainId,
    requestChangeChainId,
  } = useConnectWallet();

  //   const handleInstallMetamask = () => {
  //     handleOpenWindow("https://metamask.io/");
  //   };

  const handleConnectWallet = useCallback(
    async (walletKey: SUPPORTED_WALLET) => {
      try {
        const wallet = SUPPORTED_WALLETS[walletKey];
        await tryActivationEVM(wallet.connector);
      } catch (error) {
        console.log({ error });
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
          text={`Connect ${SUPPORTED_WALLETS[WalletKeys.Sequence].name}`}
        />
      </StyledBox>
      {isMetamask && (
        <StyledBox>
          <ConnectWalletButton
            handleClick={() => {
              handleConnectWallet(WalletKeys.Metamask);
            }}
            src={SUPPORTED_WALLETS[WalletKeys.Metamask].icon}
            text={`Connect ${SUPPORTED_WALLETS[WalletKeys.Metamask].name}`}
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
            text={`Connect ${SUPPORTED_WALLETS[WalletKeys.WalletConnect].name}`}
          />
        </StyledBox>
      )}
    </>
  );
};

export default ConnectWalletButtons;
