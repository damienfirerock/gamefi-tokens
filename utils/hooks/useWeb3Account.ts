import { useEffect, useState } from "react";

import { configureChains } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

const { chains } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);

const metamaskConnector = new MetaMaskConnector();

// Note: Sequence Wallet Connector uses require
// Cannot be imported for use straight,
// unless converted to dynamic import
// Error Msg: Instead change the require of index.js, to a dynamic import() which is available in all CommonJS modules
// Unaware of any other solution other than asynchronous import
// Relevant StackOverFloe Link: https://stackoverflow.com/questions/71804844/how-would-you-fix-an-err-require-esm-error
const getSequenceConnector = () =>
  import("@0xsequence/wagmi-connector").then(
    ({ SequenceConnector }) =>
      new SequenceConnector({
        chains,
        options: {
          connect: {
            app: "XY3",
            networkId: 137,
          },
        },
      })
  );

// Pending: Metamask update to be compatitble with WalletConnect V2
// https://github.com/MetaMask/metamask-mobile/issues/3957
// Currently stated as 18th June
const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    metadata: {
      name: "wagmi",
      description: "my wagmi app",
      url: "https://wagmi.sh",
      icons: ["https://wagmi.sh/icon.png"],
    },
  },
});

// Hook to centralise all wagmi imports in one place
// Especially due to certain workarounds (i.e. require issue for Sequence connector)
const useWagmiLibrary = () => {
  const [sequenceConnector, setSequenceConnector] = useState<any | null>(null);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { connect: metamaskConnect } = useConnect({
    connector: metamaskConnector,
  });

  const { connect: sequenceConnect } = useConnect({
    connector: sequenceConnector,
  });

  const { connect: walletConnectConnect } = useConnect({
    connector: walletConnectConnector,
  });

  const setupSequenceConnector = async () => {
    const nextSequenceConntactor = await getSequenceConnector();
    setSequenceConnector(nextSequenceConntactor);
  };

  useEffect(() => {
    setupSequenceConnector();
  }, []);

  return {
    address,
    isConnected,
    sequenceConnect,
    metamaskConnect,
    walletConnectConnect,
    disconnect,
  };
};

export default useWagmiLibrary;
