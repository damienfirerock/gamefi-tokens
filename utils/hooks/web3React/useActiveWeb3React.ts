import { AbstractConnector } from "@web3-react/abstract-connector";
import { useMemo } from "react";

import { walletconnect } from "../../../constants/connectors";
import {
  SUPPORTED_WALLET,
  SUPPORTED_WALLETS,
} from "../../../constants/wallets";
import { detectInjectedType } from "../../web3";

import { ChainId } from "../../../constants/networks";
import useWeb3React from "./useWeb3React";

export function useActiveWeb3React(): {
  account?: string;
  walletKey: SUPPORTED_WALLET | undefined;
  walletEVM: {
    isConnected: boolean;
    walletKey?: string | number;
    connector?: AbstractConnector;
    chainId?: ChainId;
  };
} {
  const {
    connector: connectedConnectorEVM,
    active: isConnectedEVM,
    account,
    chainId: chainIdEVM,
  } = useWeb3React();

  const addressEVM = account ?? undefined;

  const walletKeyEVM = useMemo(() => {
    if (!isConnectedEVM) return undefined;

    const detectedWallet = detectInjectedType();

    if (connectedConnectorEVM === walletconnect) {
      return "WALLET_CONNECT";
    }

    return (
      detectedWallet ??
      (Object.keys(SUPPORTED_WALLETS) as SUPPORTED_WALLET[]).find(
        (walletKey) => {
          const wallet = SUPPORTED_WALLETS[walletKey];
          return isConnectedEVM && wallet.connector === connectedConnectorEVM;
        }
      )
    );
  }, [connectedConnectorEVM, isConnectedEVM]);

  return {
    account: addressEVM,
    walletKey: walletKeyEVM,
    walletEVM: useMemo(() => {
      return {
        isConnected: isConnectedEVM,
        connector: connectedConnectorEVM,
        walletKey: walletKeyEVM,
        chainId: chainIdEVM,
      };
    }, [isConnectedEVM, connectedConnectorEVM, walletKeyEVM, chainIdEVM]),
  };
}

export default useActiveWeb3React;
