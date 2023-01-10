import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { ETHAuth, Proof } from "@0xsequence/ethauth";
import { sequence } from "0xsequence";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";

import useDispatchErrors from "./useDispatchErrors";

const useSequenceWallet = () => {
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const [wallet, setWallet] = useState<sequence.provider.Wallet | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  console.log({ wallet });

  const initSequence = async () => {
    setLoading(true);

    const sequenceInstance = sequence;
    await sequenceInstance.initWallet("mumbai");
    const wallet = sequenceInstance.getWallet();
    setWallet(wallet);

    setLoading(false);
  };

  const connect = async (
    authorize: boolean = false,
    withSettings: boolean = false
  ) => {
    setLoading(true);

    if (isWalletConnected) {
      setLoading(false);
      sendTransactionErrorOnMetaMaskRequest("Already connected");
      return;
    }

    try {
      const wallet = sequence.getWallet();

      await wallet.connect({
        app: "XY3",
        authorize,
        askForEmail: true,
        // keepWalletOpened: true,
        ...(withSettings && {
          settings: {
            // Specify signInWithEmail with an email address to allow user automatically sign in with the email option.
            // signInWithEmail: 'user@email.com',
            // Specify signInOptions to pick the available sign in options.
            // signInOptions: ['email', 'google', 'apple'],
            theme: "goldDark",
            bannerUrl: `${window.location.origin}/XY3-banner.png`, // FIXME: Not showing for unknown reason
            includedPaymentProviders: ["moonpay"],
            defaultFundingCurrency: "matic",
            defaultPurchaseAmount: 111,
          },
        }),
      });

      const connectionResult = wallet.isConnected();

      setIsWalletConnected(connectionResult);
      setLoading(false);
    } catch (e) {
      sendTransactionErrorOnMetaMaskRequest(e);
      setLoading(false);
    }
  };

  const disconnect = () => {
    const wallet = sequence.getWallet();
    wallet.disconnect();
    setIsWalletConnected(false);
  };

  const openWallet = () => {
    const wallet = sequence.getWallet();
    wallet.openWallet();
  };

  const openWalletWithSettings = () => {
    const wallet = sequence.getWallet();

    const settings: Settings = {
      theme: "goldDark",
      includedPaymentProviders: ["moonpay", "ramp", "wyre"],
      defaultFundingCurrency: "matic", // Default is USDC
      defaultPurchaseAmount: 400,
      lockFundingCurrencyToDefault: false,
    };
    const intent: OpenWalletIntent = {
      type: "openWithOptions",
      options: {
        settings,
      },
    };
    const path = "wallet/add-funds";
    wallet.openWallet(path, intent);
  };

  const closeWallet = () => {
    const wallet = sequence.getWallet();
    wallet.closeWallet();
  };

  useEffect(() => {
    initSequence();
  }, []);

  useEffect(() => {
    wallet && setIsWalletConnected(wallet.isConnected());
  }, [wallet]);

  return {
    // provider,
    // account,
    // chainId,
    // requestConnect,
    // requestChangeChainId,
    isWalletConnected,
    loading,
    connect,
    disconnect,
    openWallet,
    openWalletWithSettings,
    closeWallet,
  };
};

export default useSequenceWallet;
