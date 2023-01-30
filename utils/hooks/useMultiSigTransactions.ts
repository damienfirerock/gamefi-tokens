import { ethers } from "ethers";
import { useState } from "react";

import useDispatchErrors from "./useDispatchErrors";

import {
  IUserTransaction,
  ISignatureDetails,
} from "../../interfaces/ITransaction";

const MultiSigWalletJson = require("../abis/MultiSigWallet.json");

const NEXT_PUBLIC_MULTISIG_ADDRESS = process.env.NEXT_PUBLIC_MULTISIG_ADDRESS;

const useMultiSigTransactions = () => {
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const [isOwner, setIsOwner] = useState<Boolean>(false);
  const [txnCount, setTxnCount] = useState<number>(0);
  const [txnDetails, setTxnDetails] = useState<IUserTransaction | null>(null);
  const [sigDetails, setSigDetails] = useState<ISignatureDetails | null>(null);

  const runPreChecks = async () => {
    const { ethereum } = window as any;

    if (!window || !ethereum) {
      sendTransactionError("No wallet installed");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum, "any");

    let walletAddress;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      walletAddress = accounts[0]; // first account in MetaMask
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    const { chainId } = await provider.getNetwork();

    if (chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "")) {
      sendTransactionError("Please switch to Mumbai network");
      return;
    }

    const signer = provider.getSigner(walletAddress);

    return { signer };
  };

  const checkIfMultiSigOwner = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      const address = await signer.getAddress();
      result = await multiSigContract.isOwner(address);
      setIsOwner(result);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const getTransactionCount = async (): Promise<number> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return 0;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await multiSigContract.getTransactionCount();
      setTxnCount(Number(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return Number(result);
  };

  const getTransactionDetails = async (
    txIndex: number
  ): Promise<IUserTransaction | null> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return null;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    try {
      const result = await multiSigContract.getTransaction(txIndex);

      let transactionDetails: IUserTransaction | null = null;

      if (result.length === 5 && !result[3].executed) {
        const userConfirmation = await getOwnerConfirmationStatus(txIndex);

        transactionDetails = {
          to: result[0],
          value: Number(result[1]),
          data: result[2],
          executed: result[3],
          confirmations: Number(result[4]),
          userConfirmed: userConfirmation,
        };

        setTxnDetails(transactionDetails);

        return transactionDetails;
      }
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }

    return null;
  };

  const getOwnerConfirmationStatus = async (
    txIndex: number
  ): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    const address = await signer.getAddress();

    let result;

    try {
      result = await multiSigContract.isConfirmed(txIndex, address);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const getSignatureDetails = async (txIndex: number) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    const address = await signer.getAddress();

    try {
      const nextNonce = await multiSigContract.getNextNonce();
      const hash = await multiSigContract.getMessageHash(
        Number(nextNonce),
        txIndex,
        address
      );
      const nextDetails = { hash, txIndex, address, nonce: Number(nextNonce) };
      setSigDetails(nextDetails);

      return nextDetails;
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }
  };

  const getTxnSignature = async (txIndex: number) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    const address = await signer.getAddress();

    try {
      const nextNonce = await multiSigContract.getNextNonce();
      const hash = await multiSigContract.getMessageHash(
        Number(nextNonce),
        txIndex,
        address
      );
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));

      const result = await multiSigContract.verify(
        nextNonce,
        txIndex,
        address,
        signature
      );

      return signature;
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }
  };

  return {
    isOwner,
    txnCount,
    txnDetails,
    sigDetails,
    checkIfMultiSigOwner,
    getTransactionCount,
    getTransactionDetails,
    getOwnerConfirmationStatus,
    getSignatureDetails,
    getTxnSignature,
  };
};

export default useMultiSigTransactions;
