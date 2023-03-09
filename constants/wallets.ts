import { isMobile } from "react-device-detect";
import { AbstractConnector } from "@web3-react/abstract-connector";

import { injected, sequence, walletconnect } from "./connectors";
import MetaMaskIcon from "../public/wallets/metamask.svg";
import SequenceIcon from "../public/wallets/sequence-icon.svg";
import WalletConnectIcon from "../public/wallets/wallet-connect.svg";

// Ref: https://github.com/solana-labs/wallet-adapter/blob/05e3c3d864831ded29b1100ef2b0e4fd4b936e30/packages/core/base/src/adapter.ts
export enum WalletReadyState {
  /**
   * User-installable wallets can typically be detected by scanning for an API
   * that they've injected into the global context. If such an API is present,
   * we consider the wallet to have been installed.
   */
  Installed = "Installed",
  NotDetected = "NotDetected",
  /**
   * Loadable wallets are always available to you. Since you can load them at
   * any time, it's meaningless to say that they have been detected.
   */
  Loadable = "Loadable",
  /**
   * If a wallet is not supported on a given platform (eg. server-rendering, or
   * mobile) then it will stay in the `Unsupported` state.
   */
  Unsupported = "Unsupported",
}

export const detectMetamask = () => {
  if (!window.ethereum) {
    return isMobile
      ? WalletReadyState.Unsupported
      : WalletReadyState.NotDetected;
  }
  // In Brave browser, by default ethereum.isMetaMask and ethereum.isBraveWallet is true even Metamask not installed
  if (window.ethereum?.isMetaMask && !window.ethereum?.isBraveWallet)
    return WalletReadyState.Installed;
  return WalletReadyState.NotDetected;
};

export interface WalletInfo {
  name: string;
  icon: string;
  iconLight: string;
  installLink?: string;
  href?: string;
}

export interface EVMWalletInfo extends WalletInfo {
  connector: AbstractConnector;
  readyState: () => WalletReadyState;
}

export enum WalletKeys {
  Metamask = "METAMASK",
  Sequence = "SEQUENCE",
  WalletConnect = "WALLET_CONNECT",
}

export const SUPPORTED_WALLETS: { [key: string]: EVMWalletInfo } = {
  [WalletKeys.Metamask]: {
    connector: injected,
    name: "MetaMask",
    icon: MetaMaskIcon,
    iconLight: MetaMaskIcon,
    installLink: "https://metamask.io/download",
    readyState: detectMetamask,
  } as EVMWalletInfo,
  [WalletKeys.Sequence]: {
    connector: sequence,
    name: "Sequence",
    icon: SequenceIcon,
    iconLight: SequenceIcon,
    installLink: "https://sequence.xyz/",
    readyState: () => WalletReadyState.Installed,
  } as EVMWalletInfo,
  [WalletKeys.WalletConnect]: {
    connector: walletconnect,
    name: "WalletConnect",
    icon: WalletConnectIcon,
    iconLight: WalletConnectIcon,
    installLink: "https://walletconnect.com/",
    readyState: () => WalletReadyState.Installed,
  } as EVMWalletInfo,
} as const;

export type SUPPORTED_WALLET = keyof typeof SUPPORTED_WALLETS;
