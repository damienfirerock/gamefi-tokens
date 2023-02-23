import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import {
  setHasClaimed,
  setPastClaimed,
  setMerkleRoot,
  setWalletBalance,
} from "../../features/AirdropSlice";
import { formatTokenValue } from "../../utils/common";

import { AirdropType } from "../../interfaces/IAirdrop";

const SingleUseAirdropWalletJson = require("../abis/SingleUseMerkleAirdrop.json");
const CumulativeAirdropWalletJson = require("../abis/CumulativeMerkleAirdrop.json");
const ERC20ABI = require("../abis/ERC20-ABI.json");

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

  const address =
    type === AirdropType.SINGLE_USE
      ? NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS
      : NEXT_PUBLIC_CUMULATIVE_MERKLE_AIRDROP_ADDRESS;

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

  const checkIfClaimed = async (): Promise<boolean> => {
    if (type === AirdropType.CUMULATIVE) {
      sendTransactionError("Method is for Single Use Airdrop");
      return false;
    }

    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const airdropContract = new ethers.Contract(
      address || "",
      SingleUseAirdropWalletJson.abi,
      signer
    );

    let result;

    try {
      const address = await signer.getAddress();
      result = await airdropContract.hasClaimed(address);

      dispatch(setHasClaimed(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const checkPastClaim = async (): Promise<number> => {
    if (type === AirdropType.SINGLE_USE) {
      sendTransactionError("Method is for Cumulative Airdrop");
      return 0;
    }

    const { signer } = (await runPreChecks()) || {};

    if (!signer) return 0;

    const airdropContract = new ethers.Contract(
      address || "",
      CumulativeAirdropWalletJson.abi,
      signer
    );

    let result;

    try {
      const address = await signer.getAddress();
      result = await airdropContract.cumulativeClaimed(address);

      dispatch(setPastClaimed(formatValue(result)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return result;
  };

  const getMerkleRoot = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const airdropContract = new ethers.Contract(
      address || "",
      SingleUseAirdropWalletJson.abi,
      signer
    );

    let result;

    try {
      result = await airdropContract.merkleRoot();

      dispatch(setMerkleRoot(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const checkWalletBalance = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const tokenContract = new ethers.Contract(
      NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS || "",
      ERC20ABI,
      signer
    );

    let result;

    try {
      result = await tokenContract.balanceOf(signer._address);

      const nextValue = formatValue(result);

      dispatch(setWalletBalance(Number(nextValue)));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }

    return result;
  };

  const submitClaim = async (amount: BigInt, proof: string[]) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return;

    const airdropContract = new ethers.Contract(
      address || "",
      SingleUseAirdropWalletJson.abi,
      signer
    );

    try {
      const transaction = await airdropContract.claim(
        signer._address,
        amount,
        proof
      );
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
    checkWalletBalance,
    submitClaim,
  };
};

export default useAirdropTransactions;
