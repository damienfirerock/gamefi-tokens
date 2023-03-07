import checkForBraveBrowser from "./checkForBraveBrowser";
import { chainId } from "../constants/connectors";
import { NETWORKS_INFO_CONFIG } from "../constants/networks";

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
