import { SequenceConnector } from "@0xsequence/web3-react-v6-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { ChainId, NETWORKS_INFO_CONFIG } from "./networks";

export const chainId: ChainId =
  parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID!) || 137;

console.log({ chainId });

const NETWORK_URL = NETWORKS_INFO_CONFIG[chainId].rpcUrl;

console.log({ NETWORK_URL });

const options = {
  appName: "XY3",
};

// Sequence Connector
export const sequence = new SequenceConnector({
  chainId,
  appName: options.appName,
});

// Metamask Connector
const injectedConnectorParam = {
  supportedChainIds: [chainId],
};
export const injected = new InjectedConnector(injectedConnectorParam);

// Wallet Connect
export const walletconnect = new WalletConnectConnector({
  // supportedChainIds: [137, 80001],
  // rpc: NETWORK_URL,
  rpc: {
    [chainId]: NETWORK_URL,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});
