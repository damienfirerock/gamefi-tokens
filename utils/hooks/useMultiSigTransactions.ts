import { ethers } from "ethers";
import { sequence } from "0xsequence";

import useDispatchErrors from "./useDispatchErrors";

const MultiSigWalletJson = require("../abis/MultiSigWallet.json");

const NEXT_PUBLIC_MULTISIG_ADDRESS = process.env.NEXT_PUBLIC_MULTISIG_ADDRESS;

const useMultiSigTransactions = () => {
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const checkIfMultiSigOwner = async (address: string): Promise<boolean> => {
    // Get the wallet signer interface
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    if (!signer) return false;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await multiSigContract.isOwner(address);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const getTransactionCount = async (): Promise<number> => {
    // Get the wallet signer interface
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    if (!signer) return 0;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await multiSigContract.getTransactionCount();
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return Number(result);
  };

  const getTransactionDetails = async (
    txIndex: number
  ): Promise<Array<any>> => {
    // Get the wallet signer interface
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    if (!signer) return [];

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await multiSigContract.getTransaction(txIndex);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return [];
    }
    console.log({ result });
    return result;
  };

  const getOwnerConfirmationStatus = async (
    txIndex: number
  ): Promise<boolean> => {
    const wallet = sequence.getWallet();
    const signer = wallet.getSigner();

    if (!signer) return false;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    const address = await wallet.getAddress();

    let result;

    try {
      result = await multiSigContract.isConfirmed(txIndex, address);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  return {
    checkIfMultiSigOwner,
    getTransactionCount,
    getTransactionDetails,
    getOwnerConfirmationStatus,
  };
};

export default useMultiSigTransactions;
