import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import { IUserTransaction } from "../../interfaces/ITransaction";
import { MultiSigTxnType } from "../../pages/api/multisig";
import { handleDecodeCalldataWith4Bytes } from "../callDataDecoder";
import {
  setIsOwner,
  setTxnCount,
  setTxnIndex,
  setConfirmationsRequired,
  setDecodedData,
  setTxnDetails,
  setSigDetails,
} from "../../features/TransactionSlice";

const MultiSigWalletJson = require("../abis/MultiSigWallet.json");

const NEXT_PUBLIC_MULTISIG_ADDRESS = process.env.NEXT_PUBLIC_MULTISIG_ADDRESS;

const useMultiSigTransactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  // Note: Important to run pre-checks before every transaction
  // But may be a bit excessive during initial setup in transaction details
  // Unfortunately, will still require the checking of connection in subsequent transactions
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
      dispatch(setIsOwner(result));
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
      const nextCount = Number(result);
      dispatch(setTxnCount(nextCount));
      dispatch(setTxnIndex(nextCount - 1));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return Number(result);
  };

  const getNumOfConfirmationsRequired = async (): Promise<number> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return 0;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await multiSigContract.numConfirmationsRequired();
      const nextNum = Number(result);
      dispatch(setConfirmationsRequired(nextNum));
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

        dispatch(setTxnDetails(transactionDetails));

        const data = await handleDecodeCalldataWith4Bytes(
          transactionDetails.data
        );
        if (!!data?.[0]) {
          dispatch(setDecodedData(data[0]));
        }

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
      dispatch(setSigDetails(nextDetails));

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

      return signature;
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }
  };

  const runTransaction = async (txIndex: number, type: MultiSigTxnType) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return;

    const multiSigContract = new ethers.Contract(
      NEXT_PUBLIC_MULTISIG_ADDRESS || "",
      MultiSigWalletJson.abi,
      signer
    );

    let transaction;

    try {
      if (type === MultiSigTxnType.CONFIRM) {
        transaction = await multiSigContract.confirmTransaction(txIndex);
      } else if (type === MultiSigTxnType.REVOKE) {
        transaction = await multiSigContract.revokeConfirmation(txIndex);
      } else if (type === MultiSigTxnType.EXECUTE) {
        transaction = await multiSigContract.executeTransaction(txIndex);
      }
      await transaction.wait(10);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  return {
    checkIfMultiSigOwner,
    getTransactionCount,
    getTransactionDetails,
    getNumOfConfirmationsRequired,
    getOwnerConfirmationStatus,
    getSignatureDetails,
    getTxnSignature,
    runTransaction,
  };
};

export default useMultiSigTransactions;
