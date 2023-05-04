import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import { formatTokenValue } from "../common";
import useWeb3React from "./web3React/useWeb3React";
import { getContract } from "../web3";
import { setWalletBalance } from "../../features/AccountSlice";
import { setSuccess } from "../../features/TransactionSlice";

const ERC20ABI = require("../../constants/abis/ERC20-ABI.json");

const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;
const NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER =
  process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER;

const formatValue = (result: any) => {
  const nextResult = BigInt(result).toString();
  const nextValue = formatTokenValue(nextResult, 18);

  return nextValue;
};

const useCommonWeb3Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const { account, library } = useWeb3React();

  const fireRockGoldContract = useMemo(() => {
    if (!library || !account) {
      return null;
    }

    return getContract(
      NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS!,
      ERC20ABI,
      library,
      account
    );
  }, [library, account]);

  const checkWalletBalance = async (): Promise<boolean> => {
    let result;

    try {
      if (!fireRockGoldContract) {
        throw Error("Invalid Connection");
      }

      result = await fireRockGoldContract.balanceOf(account);

      const nextValue = formatValue(result);

      dispatch(setWalletBalance(Number(nextValue)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  async function checkTransactionStatus(
    txHash: string,
    interval: number = 5000
  ) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER
      );
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt) {
        if (receipt.status === 1) {
          dispatch(setSuccess(`Transaction ${txHash} was successful`));
          console.log("Transaction was successful");
        } else if (receipt.status === 0) {
          sendTransactionError(`Transaction (${txHash}) failed`);
        } else {
          console.log("Transaction is still pending");
          setTimeout(() => checkTransactionStatus(txHash, interval), interval);
        }
      } else {
        console.log("Transaction not found or still pending");
        setTimeout(() => checkTransactionStatus(txHash, interval), interval);
      }
    } catch (error) {
      sendTransactionErrorOnMetaMaskRequest(error);
    }
  }

  return {
    checkWalletBalance,
    checkTransactionStatus,
  };
};

export default useCommonWeb3Transactions;
