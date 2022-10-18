import { useState, useEffect } from "react";

import { ethers } from "ethers";

const useConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const findProvider = async () => {
    if (!window) return;

    const { ethereum } = window as any;

    const nextProvider = new ethers.providers.Web3Provider(ethereum, "any");

    setProvider(nextProvider);
  };

  const accountChangedHandler = async (newAccount: any) => {
    const address = await newAccount.getAddress();
    setAccount(address);

    enquireChainId();
  };

  const enquireChainId = async () => {
    const network = await provider.getNetwork();

    if (network?.chainId) {
      setChainId(network.chainId);
    }
  };

  const enquireAccounts = async () => {
    const accounts = await provider.listAccounts();

    if (accounts?.[0]) {
      setAccount(accounts[0]);
    }
  };

  const checkConnection = async () => {
    await enquireChainId();
    await enquireAccounts();
  };

  const requestConnect = async () => {
    provider.send("eth_requestAccounts", []).then(async () => {
      await accountChangedHandler(provider.getSigner());
    });
  };

  const requestChangeChainId = async () => {
    if (!window) return;

    const { ethereum } = window as any;

    ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x5",
        },
      ],
    });
  };

  useEffect(() => {
    // window exists only in browser
    if (!window) return;

    const { ethereum } = window as any;

    if (ethereum) {
      findProvider();
    } else {
      setError("Please Install Metamask");
    }
  }, []);

  useEffect(() => {
    if (!provider) return;

    checkConnection();
  }, [provider, checkConnection]);

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum?.on) {
      ethereum.on("connect", checkConnection);
      ethereum.on("disconnect", checkConnection);
      ethereum.on("chainChanged", enquireChainId);
      ethereum.on("accountsChanged", checkConnection);
      ethereum.on("chainChanged", enquireChainId);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", checkConnection);
          ethereum.removeListener("disconnect", checkConnection);
          ethereum.removeListener("chainChanged", enquireChainId);
          ethereum.removeListener("accountsChanged", checkConnection);
          ethereum.removeListener("chainChanged", enquireChainId);
        }
      };
    }
  }, [checkConnection, enquireChainId]);

  return {
    provider,
    account,
    chainId,
    error,
    requestConnect,
    requestChangeChainId,
  };
};

export default useConnectWallet;
