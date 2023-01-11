import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { ETHAuth, Proof } from "@0xsequence/ethauth";
import { sequence } from "0xsequence";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";

import useDispatchErrors from "./useDispatchErrors";

const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

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
    const path = "wallet";
    wallet.openWallet(path, intent);
  };

  const closeWallet = () => {
    const wallet = sequence.getWallet();
    wallet.closeWallet();
  };

  const sendMatic = async (amount: string, address: string) => {
    setLoading(true);

    // Get the wallet signer interface
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    const value = ethers.utils.parseUnits(amount, 18);
    // Prepare Transaction object
    const tx: sequence.transactions.Transaction = {
      to: address,
      value,
    };

    try {
      // Send the transaction via the signer to the blockchain :D The signer will prompt the user
      // sign+send the transaction, and once the user confirms it will be transmitted.
      const txnResp = await signer.sendTransaction(tx);

      // Wait for the transaction to be mined by the network
      await txnResp.wait();

      setLoading(false);
    } catch (e) {
      sendTransactionErrorOnMetaMaskRequest(e);
      setLoading(false);
    }
  };

  const sendFrg = async (amount: string, address: string) => {
    setLoading(true);

    // Part of the ERC20 ABI, so we can encode a `transfer` call
    const erc20Interface = new ethers.utils.Interface([
      "function transfer(address _to, uint256 _value)",
    ]);

    // Get the wallet signer interface
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    const value = ethers.utils.parseUnits(amount, 18);

    // Encode an ERC-20 token transfer to recipient of the specified amount
    const data = erc20Interface.encodeFunctionData("transfer", [
      address,
      value,
    ]);

    // Prepare Transaction object
    const tx: sequence.transactions.Transaction = {
      to: NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS || "",
      data,
    };

    try {
      // Send the transaction via the signer to the blockchain :D The signer will prompt the user
      // sign+send the transaction, and once the user confirms it will be transmitted.
      const txnResp = await signer.sendTransaction(tx);

      // Wait for the transaction to be mined by the network
      await txnResp.wait();

      setLoading(false);
    } catch (e) {
      sendTransactionErrorOnMetaMaskRequest(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    initSequence();
  }, []);

  useEffect(() => {
    wallet && setIsWalletConnected(wallet.isConnected());
  }, [wallet]);

  return {
    isWalletConnected,
    loading,
    connect,
    disconnect,
    openWallet,
    openWalletWithSettings,
    closeWallet,
    sendMatic,
    sendFrg,
  };
};

export default useSequenceWallet;
