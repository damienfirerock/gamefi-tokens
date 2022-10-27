import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import {
  addPendingTransaction,
  removePendingTransaction,
} from "../../features/TransactionsSlice";
import { updateDBAfterTokenSalePurchase } from "../../features/ProductsSlice";
import {
  updateDBAfterPokemonCenterDeposit,
  updateDBAfterPokemonCenterWithdrawal,
} from "../../features/DepositsSlice";
import { TransactionType } from "../../interfaces/ITransaction";
import useDispatchErrors from "./useDispatchErrors";

const ThunderDomeNFTJson = require("../abis/ThunderDomeNFT.json");
const NFTSaleJson = require("../abis/NFTSale.json");
const PokemonCenterJson = require("../abis/PokemonCenter.json");
const PokePointJson = require("../abis/PokePoint.json");

const { NEXT_PUBLIC_POKEPOINT_ADDRESS } = process.env;

interface ITransactionCheck {
  nextTransaction: {
    tokenId?: number;
    description?: string;
    name?: string;
    type: TransactionType;
  };
  methodOnFailure: (error: any) => void;
}

const useWeb3Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

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
      sendTransactionError("Please switch to Goerli network");
      return;
    }

    const signer = provider.getSigner(walletAddress);

    return { signer };
  };

  const runPreTransactionChecks = async (props: ITransactionCheck) => {
    const { ethereum } = window as any;

    if (!window || !ethereum) {
      sendTransactionError("No wallet installed");
      return;
    }

    const { nextTransaction, methodOnFailure } = props;

    const provider = new ethers.providers.Web3Provider(ethereum, "any");

    dispatch(addPendingTransaction(nextTransaction));

    let walletAddress;

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      walletAddress = accounts[0]; // first account in MetaMask
    } catch (error: any) {
      methodOnFailure(error);
      return;
    }

    const { chainId } = await provider.getNetwork();

    if (chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "")) {
      methodOnFailure("Please switch to Goerli network");
      return;
    }

    const signer = provider.getSigner(walletAddress);

    return { signer };
  };

  const purchaseNFT = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.TokenSalePurchase,
    };

    const dispatchAfterFailure = (error: any) => {
      dispatch(removePendingTransaction(nextTransaction));
      sendTransactionErrorOnMetaMaskRequest(error);
    };

    const { signer } =
      (await runPreTransactionChecks({
        nextTransaction,
        methodOnFailure: dispatchAfterFailure,
      })) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const tokenSaleContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS || "",
      NFTSaleJson.abi,
      signer
    );

    let transaction;
    let receipt: any;

    try {
      transaction = await tokenSaleContract.purchaseNFT(tokenId, { value: 5 });
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterTokenSalePurchase({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );

      dispatch(removePendingTransaction(nextTransaction));
    };

    // await setTimeout(async () => {
    if (receipt) {
      await dispatchAfterSuccess();
    } else {
      dispatchAfterFailure("Un-received Transaction");
    }
    // }, 10000);
  };

  const depositPokemon = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.StakingDeposit,
    };

    const dispatchAfterFailure = (error: any) => {
      dispatch(removePendingTransaction(nextTransaction));
      sendTransactionErrorOnMetaMaskRequest(error);
    };

    const { signer } =
      (await runPreTransactionChecks({
        nextTransaction,
        methodOnFailure: dispatchAfterFailure,
      })) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    let transaction;
    let receipt: any;

    const thunderDomeNFTContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS || "",
      ThunderDomeNFTJson.abi,
      signer
    );

    try {
      transaction = await thunderDomeNFTContract.approve(
        process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS,
        tokenId
      );
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const pokemonCenterContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
      PokemonCenterJson.abi,
      signer
    );

    try {
      transaction = await pokemonCenterContract.deposit(tokenId);
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterPokemonCenterDeposit({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );

      dispatch(removePendingTransaction(nextTransaction));
    };

    // await setTimeout(() => {
    if (receipt) {
      await dispatchAfterSuccess();
    } else {
      dispatchAfterFailure("Un-received Transaction");
    }
    // }, 10000);
  };

  const withdrawPokemon = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.StakingDeposit,
    };

    const dispatchAfterFailure = (error: any) => {
      dispatch(removePendingTransaction(nextTransaction));
      sendTransactionErrorOnMetaMaskRequest(error);
    };

    const { signer } =
      (await runPreTransactionChecks({
        nextTransaction,
        methodOnFailure: dispatchAfterFailure,
      })) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const pokemonCenterContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
      PokemonCenterJson.abi,
      signer
    );

    let transaction;
    let receipt: any;

    try {
      transaction = await pokemonCenterContract.withdraw(tokenId);
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterPokemonCenterWithdrawal({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );

      dispatch(removePendingTransaction(nextTransaction));
    };

    // await setTimeout(() => {
    if (receipt) {
      await dispatchAfterSuccess();
    } else {
      dispatchAfterFailure("Un-received Transaction");
    }
    // }, 10000);
  };

  const enquirePokePointsBalance = async (address: string) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const pokePointsContract = new ethers.Contract(
      NEXT_PUBLIC_POKEPOINT_ADDRESS || "",
      PokePointJson.abi,
      signer
    );

    let result;

    try {
      result = await pokePointsContract.balanceOf(address);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    return Number(result);
  };

  const calculatePokePointsYield = async (address: string) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const pokemonCenterContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
      PokemonCenterJson.abi,
      signer
    );

    let result;

    try {
      const potentialYield = await pokemonCenterContract.calculateTotalYield(
        address
      );
      const pokePointBalance = await pokemonCenterContract.pokePointBalance(
        address
      );

      result = Number(potentialYield) + Number(pokePointBalance);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    return result;
  };

  const withdrawPokePointsYield = async (address: string) => {
    const nextTransaction = {
      type: TransactionType.YieldWithdrawal,
    };

    const dispatchAfterFailure = (error: any) => {
      dispatch(removePendingTransaction(nextTransaction));
      sendTransactionErrorOnMetaMaskRequest(error);
    };

    const { signer } =
      (await runPreTransactionChecks({
        nextTransaction,
        methodOnFailure: dispatchAfterFailure,
      })) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const pokemonCenterContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
      PokemonCenterJson.abi,
      signer
    );

    let transaction;
    let receipt: any;

    try {
      transaction = await pokemonCenterContract.withdrawYield();
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const dispatchAfterSuccess = () => {
      dispatch(removePendingTransaction(nextTransaction));
    };

    // await setTimeout(() => {
    if (receipt) {
      dispatchAfterSuccess();
    } else {
      dispatchAfterFailure("Un-received Transaction");
    }
    // }, 10000);
  };

  return {
    purchaseNFT,
    depositPokemon,
    withdrawPokemon,
    enquirePokePointsBalance,
    calculatePokePointsYield,
    withdrawPokePointsYield,
  };
};

export default useWeb3Transactions;
