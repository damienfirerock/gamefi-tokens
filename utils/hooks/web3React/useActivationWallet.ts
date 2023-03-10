import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useCallback } from "react";
import { WalletKeys } from "../../../constants/wallets";

import useWeb3React from "./useWeb3React";

import { chainId } from "../../../constants/connectors";
import { SUPPORTED_WALLETS } from "../../../constants/wallets";

export const useActivationWallet = () => {
  const { activate, library } = useWeb3React();
  const tryActivationEVM = useCallback(
    async (walletKey: WalletKeys) => {
      const connector = SUPPORTED_WALLETS[walletKey].connector;

      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (connector instanceof WalletConnectConnector) {
        connector.walletConnectProvider = undefined;
      }
      if (connector) {
        try {
          await activate(connector, undefined, true);
          const activeProvider = library?.provider ?? window.ethereum;
          activeProvider?.request?.({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: "0x" + Number(chainId).toString(16),
              },
            ],
          });
          localStorage.setItem("isWalletConnected", walletKey);
        } catch (error) {
          if (error instanceof UnsupportedChainIdError) {
            await activate(connector);
          } else {
            throw error;
          }
        }
      }
    },
    [activate, library]
  );

  return {
    tryActivationEVM,
  };
};

export default useActivationWallet;
