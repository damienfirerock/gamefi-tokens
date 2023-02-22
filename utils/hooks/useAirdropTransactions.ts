import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import {
  setHasClaimed,
  setMerkleRoot,
  setWalletBalance,
} from "../../features/AirdropSlice";
import { formatTokenValue } from "../../utils/common";

const AirdropWalletJson = require("../abis/SingleUseMerkleAirdrop.json");
const ERC20ABI = require("../abis/ERC20-ABI.json");

const NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS =
  process.env.NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS;
const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

const useAirdropTransactions = () => {
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

  const checkIfClaimed = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const airdropContract = new ethers.Contract(
      NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS || "",
      AirdropWalletJson.abi,
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

  const getMerkleRoot = async (): Promise<boolean> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return false;

    const airdropContract = new ethers.Contract(
      NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS || "",
      AirdropWalletJson.abi,
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

      const nextResult = BigInt(result).toString();
      const nextValue = formatTokenValue(nextResult, 18);

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
      NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS || "",
      AirdropWalletJson.abi,
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
      console.log({ error });
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }
  };

  return {
    checkIfClaimed,
    getMerkleRoot,
    checkWalletBalance,
    submitClaim,
  };
};

export default useAirdropTransactions;
