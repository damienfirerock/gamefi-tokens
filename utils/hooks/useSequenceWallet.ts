import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { ETHAuth, Proof } from "@0xsequence/ethauth";
import { sequence } from "0xsequence";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";

import useDispatchErrors from "./useDispatchErrors";

sequence.initWallet("mumbai");

const useSequenceWallet = () => {
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState<any>(null);
  const [isWalletConnected, setIsWalletConnected] =
    useState<boolean>(false);

  const wallet = sequence.getWallet();

  const connect = async (
    authorize: boolean = false,
    withSettings: boolean = false
  ) => {
    if (isWalletConnected) {
      // addNewConsoleLine("Wallet already connected!");
      // setConsoleLoading(false);
      return;
    }

    try {
      // addNewConsoleLine("Connecting");
      const wallet = sequence.getWallet();

      const connectDetails = await wallet.connect({
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
            theme: "indigoDark",
            // bannerUrl: `${window.location.origin}${skyweaverBannerUrl}`,
            includedPaymentProviders: ["moonpay"],
            defaultFundingCurrency: "matic",
            defaultPurchaseAmount: 111,
          },
        }),
      });

      console.warn("connectDetails", {
        connectDetails,
      });

      if (authorize) {
        const ethAuth = new ETHAuth();

        if (connectDetails.proof) {
          const decodedProof = await ethAuth.decodeProof(
            connectDetails.proof.proofString,
            true
          );

          console.warn({ decodedProof });

          const isValid = await wallet.utils.isValidTypedDataSignature(
            await wallet.getAddress(),
            connectDetails.proof.typedData,
            decodedProof.signature,
            await wallet.getAuthChainId()
          );
          console.log("isValid?", isValid);
          // appendConsoleLine(`isValid?: ${isValid}`);
          if (!isValid) throw new Error("sig invalid");
        }
      }
      // appendConsoleLine("Wallet connected!");
      // setConsoleLoading(false);
      setIsWalletConnected(true);
    } catch (e) {
      console.error(e);
      // consoleErrorMessage();
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

  // const openWalletWithSettings = () => {
  //   const wallet = sequence.getWallet();

  //   const settings: Settings = {
  //     theme: "goldDark",
  //     includedPaymentProviders: ["moonpay", "ramp", "wyre"],
  //     defaultFundingCurrency: "eth",
  //     defaultPurchaseAmount: 400,
  //     lockFundingCurrencyToDefault: false,
  //   };
  //   const intent: OpenWalletIntent = {
  //     type: "openWithOptions",
  //     options: {
  //       settings,
  //     },
  //   };
  //   const path = "wallet/add-funds";
  //   wallet.openWallet(path, intent);
  // };

  const closeWallet = () => {
    const wallet = sequence.getWallet();
    wallet.closeWallet();
  };

  useEffect(() => {
    setIsWalletConnected(wallet.isConnected());
  }, [wallet]);

  return {
    // provider,
    // account,
    // chainId,
    // requestConnect,
    // requestChangeChainId,
    isWalletConnected,
    connect,
    disconnect,
    openWallet,
    closeWallet,
  };
};

export default useSequenceWallet;
