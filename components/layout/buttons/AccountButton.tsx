import React from "react";
import { Typography } from "@mui/material";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import useWagmiLibrary from "../../../utils/hooks/useWeb3Account";
import { truncateString, handleOpenWindow } from "../../../utils/common";
import CONFIG from "../../../config";

const nextNetwork = () => {
  switch (CONFIG.NETWORK_CHAIN_ID) {
    case "80001":
      return "Mumbai Testnet";
    case "137":
      return "Polygon";
    default:
      return "Network";
  }
};

// TODO: Fix for wallet connect not actually connecting
// TODO: Update useAirdropTransactions
// TODO: Add useSignTransactions for signatures between Sequence versus Metamask for binding of wallets
// TODO: Different layout for desktop versus mobile

const AccountButton: React.FunctionComponent = () => {
  const { provider, account, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();

  const {
    address,
    isConnected,
    sequenceConnect,
    metamaskConnect,
    walletConnectConnect,
    disconnect,
  } = useWagmiLibrary();

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  // if (!provider)
  //   return (
  //     <MetaMaskButton handleClick={sequenceConnect} text="Install MetaMask" />
  //   );

  if (!isConnected)
    return (
      <MetaMaskButton
        handleClick={walletConnectConnect}
        text="Connect MetaMask"
      />
    );

  if (chainId !== parseInt(CONFIG.NETWORK_CHAIN_ID || "80001"))
    return (
      <MetaMaskButton
        handleClick={requestChangeChainId}
        text={`Change to ${nextNetwork()}`}
      />
    );

  return (
    <>
      <MenuStyledButton variant="contained" disabled={true}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {/* {truncateString(account)} */}
          {address}
        </Typography>
      </MenuStyledButton>
      <MenuStyledButton
        variant="contained"
        // disabled={true}
        onClick={() => disconnect()}
      >
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Disconnect
        </Typography>
      </MenuStyledButton>
    </>
  );
};

export default AccountButton;
