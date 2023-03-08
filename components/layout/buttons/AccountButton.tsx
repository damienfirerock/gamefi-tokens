import React, { useCallback } from "react";
import { Typography } from "@mui/material";

import MetaMaskButton from "./common/MetaMaskButton";
import MenuStyledButton from "./common/MenuStyledButton";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import { truncateString, handleOpenWindow } from "../../../utils/common";
import CONFIG from "../../../config";
import useActivationWallet from "../../../utils/hooks/web3React/useActivationWallet";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useDispatchErrors from "../../../utils/hooks/useDispatchErrors";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import {
  SUPPORTED_WALLET,
  SUPPORTED_WALLETS,
} from "../../../constants/wallets";

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
  const { sendTransactionError } = useDispatchErrors();
  const { provider, chainId, requestConnect, requestChangeChainId } =
    useConnectWallet();
  const { active, connector, error, deactivate } = useWeb3React();
  const { tryActivationEVM } = useActivationWallet();
  const { account, walletKey } = useActiveWeb3React();

  const handleInstallMetamask = () => {
    handleOpenWindow("https://metamask.io/");
  };

  const handleWalletChange = useCallback(
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

  if (!provider)
    return (
      <MetaMaskButton
        handleClick={() => handleWalletChange("WALLET_CONNECT")}
        text="Install MetaMask"
      />
    );

  if (!account)
    return (
      <MetaMaskButton
        handleClick={() => {
          console.log("ITS HAPPENING");
          handleWalletChange("WALLET_CONNECT");
        }}
        text="Connect MetaMask"
      />
    );

  // if (chainId !== parseInt(CONFIG.NETWORK_CHAIN_ID || "80001"))
  //   return (
  //     <MetaMaskButton
  //       handleClick={requestChangeChainId}
  //       text={`Change to ${nextNetwork()}`}
  //     />
  //   );

  return (
    <>
      <MenuStyledButton variant="contained" disabled={true}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {truncateString(account)}
        </Typography>
      </MenuStyledButton>
      <MenuStyledButton
        variant="contained"
        // disabled={true}
        // onClick={() => disconnect()}
        onClick={deactivate}
      >
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Disconnect
        </Typography>
      </MenuStyledButton>
    </>
  );
};

export default AccountButton;
