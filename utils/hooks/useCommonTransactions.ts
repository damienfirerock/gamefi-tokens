import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import { formatTokenValue } from "../../utils/common";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { getContract } from "../web3";
import { setWalletBalance } from "../../features/AccountSlice";

const ERC20ABI = require("../../constants/abis/ERC20-ABI.json");

const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

const formatValue = (result: any) => {
  const nextResult = BigInt(result).toString();
  const nextValue = formatTokenValue(nextResult, 18);

  return nextValue;
};

const useCommonWeb3Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

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

  return {
    checkWalletBalance,
  };
};

export default useCommonWeb3Transactions;
