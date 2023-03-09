import { ethers } from "ethers";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import checkForBraveBrowser from "./checkForBraveBrowser";
import { chainId } from "../constants/connectors";
import { NETWORKS_INFO_CONFIG } from "../constants/networks";
import { ZERO_ADDRESS } from "../constants/common";

export const getEtherscanLink = (
  data: string,
  type: "transaction" | "token" | "address" | "block"
): string => {
  const prefix = NETWORKS_INFO_CONFIG[chainId].etherscanUrl;

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
};

// https://docs.cloud.coinbase.com/wallet-sdk/docs/injected-provider#properties
// Coin98 and Brave wallet is overriding Metamask. So at a time, there is only 1 exists
export const detectInjectedType = (): "BRAVE" | "METAMASK" | null => {
  const { ethereum } = window;
  // When Coinbase wallet connected will inject selectedProvider property and some others props
  if (ethereum?.selectedProvider) {
    if (ethereum?.selectedProvider?.isMetaMask) return "METAMASK";
  }

  if (checkForBraveBrowser() && ethereum?.isBraveWallet) return "BRAVE";

  if (ethereum?.isMetaMask) {
    return "METAMASK";
  }
  return null;
};

// account is required
const getSigner = (library: Web3Provider, account: string): JsonRpcSigner => {
  return library.getSigner(account).connectUnchecked();
};

// account is optional
const getProviderOrSigner = (
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner => {
  return account ? getSigner(library, account) : library;
};

// account is optional
export const getContract = (
  address: string,
  ABI: ContractInterface,
  library: Web3Provider,
  account?: string
): Contract => {
  if (!ethers.utils.isAddress(address) || address === ZERO_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const provider = getProviderOrSigner(library, account) as any;

  return new Contract(address, ABI, provider);
};
