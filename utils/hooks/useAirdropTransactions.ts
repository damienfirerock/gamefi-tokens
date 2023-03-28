import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

// import {
//   setHasClaimed,
//   setPastClaimed,
//   setMerkleRoot,
//   setWalletBalance,
// } from "../../features/AirdropSlice";
import { formatTokenValue } from "../../utils/common";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { getContract } from "../web3";

import { AirdropType } from "../../interfaces/IAirdrop";

const SingleUseAirdropWalletJson = require("../../constants/abis/SingleUseMerkleAirdrop.json");
const CumulativeAirdropWalletJson = require("../../constants/abis/CumulativeMerkleAirdrop.json");
const ERC20ABI = require("../../constants/abis/ERC20-ABI.json");

const NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS =
  process.env.NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS;
const NEXT_PUBLIC_CUMULATIVE_MERKLE_AIRDROP_ADDRESS =
  process.env.NEXT_PUBLIC_CUMULATIVE_MERKLE_AIRDROP_ADDRESS;
const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

const formatValue = (result: any) => {
  const nextResult = BigInt(result).toString();
  const nextValue = formatTokenValue(nextResult, 18);

  return nextValue;
};

const useAirdropTransactions = (type: AirdropType) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const { account, library } = useWeb3React();

  const contractDetails =
    type === AirdropType.SINGLE_USE
      ? {
          address: NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS,
          abi: SingleUseAirdropWalletJson.abi,
        }
      : {
          address: NEXT_PUBLIC_CUMULATIVE_MERKLE_AIRDROP_ADDRESS,
          abi: CumulativeAirdropWalletJson.abi,
        };

  const airdropContract = useMemo(() => {
    if (!contractDetails.address || !library || !account) {
      return null;
    }

    return getContract(
      contractDetails.address,
      contractDetails.abi,
      library,
      account
    );
  }, [contractDetails.address, library, account]);

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

  const checkIfClaimed = async (): Promise<boolean> => {
    let result;

    try {
      if (type === AirdropType.CUMULATIVE) {
        throw Error("Method is for Single Use Airdrop");
      }

      if (!airdropContract) {
        throw Error("Invalid Connection");
      }

      result = await airdropContract.hasClaimed(account);

      // dispatch(setHasClaimed(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const checkPastClaim = async (): Promise<number> => {
    let result;

    try {
      if (type === AirdropType.SINGLE_USE) {
        throw Error("Method is for Cumulative Airdrop");
      }

      if (!airdropContract) {
        throw Error("Invalid Connection");
      }

      result = await airdropContract.cumulativeClaimed(account);

      // dispatch(setPastClaimed(formatValue(result)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return result;
  };

  const getMerkleRoot = async (): Promise<boolean> => {
    let result;

    try {
      if (!airdropContract) {
        throw Error("Invalid Connection");
      }

      result = await airdropContract.merkleRoot();

      // dispatch(setMerkleRoot(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const setNextMerkleRoot = async (hash: string) => {
    try {
      if (type === AirdropType.SINGLE_USE) {
        throw Error("Method is for Cumulative Airdrop");
      }

      if (!airdropContract) {
        throw Error("Invalid Connection");
      }

      const txn = await airdropContract.setMerkleRoot(hash);
      await txn.wait(10);

      const result = await airdropContract.merkleRoot();

      // dispatch(setMerkleRoot(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  const checkWalletBalance = async (): Promise<boolean> => {
    let result;

    try {
      if (!fireRockGoldContract) {
        throw Error("Invalid Connection");
      }

      result = await fireRockGoldContract.balanceOf(account);

      const nextValue = formatValue(result);

      // dispatch(setWalletBalance(Number(nextValue)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const submitClaim = async (amount: BigInt, proof: string[]) => {
    try {
      if (!airdropContract) {
        throw Error("Invalid Connection");
      }

      const transaction = await airdropContract.claim(account, amount, proof);
      await transaction.wait(10);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  return {
    checkIfClaimed,
    checkPastClaim,
    getMerkleRoot,
    setNextMerkleRoot,
    checkWalletBalance,
    submitClaim,
  };
};

export default useAirdropTransactions;
