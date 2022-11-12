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
import { updateDBAfterMarketPlaceBid } from "../../features/MarketPlaceProductsSlice";
import {
  updateDBAfterMarketPlaceListing,
  updateDBAfterMarketPlaceWithdrawal,
  updateDBAfterMarketPlaceAccept,
} from "../../features/ListingsSlice";
import { TransactionType } from "../../interfaces/ITransaction";
import useDispatchErrors from "./useDispatchErrors";

const ThunderDomeNFTJson = require("../abis/ThunderDomeNFT.json");
const NFTSaleJson = require("../abis/NFTSale.json");
const PokemonCenterJson = require("../abis/PokemonCenter.json");
const PokePointJson = require("../abis/PokePoint.json");
const LuckyDrawJson = require("../abis/LuckyDraw.json");
const MarketPlaceJson = require("../abis/MarketPlace.json");
const ExperiencePointsJson = require("../abis/ExperiencePoints.json");
const ArenaJson = require("../abis/Arena.json");

const NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS =
  process.env.NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS;
const NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS;
const NEXT_PUBLIC_POKEPOINT_ADDRESS = process.env.NEXT_PUBLIC_POKEPOINT_ADDRESS;
const NEXT_PUBLIC_POKEMON_CENTER_ADDRESS =
  process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS;
const NEXT_PUBLIC_LUCKY_DRAW_ADDRESS =
  process.env.NEXT_PUBLIC_LUCKY_DRAW_ADDRESS;
const NEXT_PUBLIC_MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const NEXT_PUBLIC_EXPERIENCE_POINTS_ADDRESS =
  process.env.NEXT_PUBLIC_EXPERIENCE_POINTS_ADDRESS;
const NEXT_PUBLIC_ARENA_ADDRESS = process.env.NEXT_PUBLIC_ARENA_ADDRESS;

interface INextTransaction {
  tokenId?: number;
  description?: string;
  name?: string;
  type: TransactionType;
}

interface ITransactionCheck {
  nextTransaction: INextTransaction;
  methodOnFailure: (error: any) => void;
}

interface IContractDetails {
  // Attempted to type with AbiItem[] from web3-utils
  // but get error that it is incompatible with readonly (string | Fragment | JsonFragment)[]
  abi: any[];
  address: string;
}

const useWeb3Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const dispatchAfterTxnFailure =
    (nextTransaction: INextTransaction) => (error: any) => {
      dispatch(removePendingTransaction(nextTransaction));
      sendTransactionErrorOnMetaMaskRequest(error);
    };

  const dispatchesUponReceipt = (
    receipt: any,
    dispatchAfterSuccess: () => void,
    nextTransaction: INextTransaction
  ) => {
    // await setTimeout(() => {
    if (receipt) {
      dispatchAfterSuccess();
    } else {
      dispatchAfterTxnFailure(nextTransaction)("Un-received Transaction");
    }
    // }, 10000);
  };

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

  const getContract = async (
    nextTransaction: INextTransaction,
    contractDetails: IContractDetails,
    methodOnFailure: (error: any) => void
  ) => {
    const { signer } =
      (await runPreTransactionChecks({
        nextTransaction,
        methodOnFailure,
      })) || {};

    if (!signer) throw Error("Error getting account");

    const { address, abi } = contractDetails;

    const contract = new ethers.Contract(address, abi, signer);

    if (!contract) throw Error("Error creating contract object");

    return contract;
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

    const contractDetails = {
      abi: NFTSaleJson.abi,
      address: NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS || "",
    };

    let receipt: any;

    try {
      const tokenSaleContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (tokenSaleContract) {
        const transaction = await tokenSaleContract.purchaseNFT(tokenId, {
          value: 5,
        });
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
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

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
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

    const contractDetails = {
      abi: ThunderDomeNFTJson.abi,
      address: NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS || "",
    };

    let receipt: any;

    try {
      const thunderDomeNFTContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (thunderDomeNFTContract) {
        const transaction = await thunderDomeNFTContract.approve(
          NEXT_PUBLIC_POKEMON_CENTER_ADDRESS,
          tokenId
        );
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const nextContractDetails = {
      abi: PokemonCenterJson.abi,
      address: NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
    };

    try {
      const pokemonCenterContract = await getContract(
        nextTransaction,
        nextContractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (pokemonCenterContract) {
        const transaction = await pokemonCenterContract.deposit(tokenId);
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
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

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
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
      type: TransactionType.StakingWithdrawal,
    };

    const contractDetails = {
      abi: PokemonCenterJson.abi,
      address: NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
    };

    let receipt: any;

    try {
      const pokemonCenterContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (pokemonCenterContract) {
        const transaction = await pokemonCenterContract.withdraw(tokenId);
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
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

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
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
      NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
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

  const withdrawPokePointsYield = async () => {
    const nextTransaction = {
      type: TransactionType.YieldWithdrawal,
    };

    const contractDetails = {
      abi: PokemonCenterJson.abi,
      address: NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
    };

    let receipt: any;

    try {
      const pokemonCenterContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      const transaction = await pokemonCenterContract.withdrawYield();
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const dispatchAfterSuccess = () => {
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const enterLuckyDraw = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.LuckyDrawEnter,
    };

    const contractDetails = {
      abi: LuckyDrawJson.abi,
      address: NEXT_PUBLIC_LUCKY_DRAW_ADDRESS || "",
    };

    let receipt: any;

    try {
      const luckyDrawContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      const transaction = await luckyDrawContract.enter();
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const dispatchAfterSuccess = () => {
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const listOnMarketPlace = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.MarketPlaceListing,
    };

    const contractDetails = {
      abi: ThunderDomeNFTJson.abi,
      address: NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS || "",
    };

    const offerPrice = 10;

    let receipt: any;

    try {
      const thunderDomeNFTContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (thunderDomeNFTContract) {
        const transaction = await thunderDomeNFTContract.approve(
          NEXT_PUBLIC_MARKETPLACE_ADDRESS,
          tokenId
        );
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const nextContractDetails = {
      abi: MarketPlaceJson.abi,
      address: NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    };

    try {
      const marketPlaceContract = await getContract(
        nextTransaction,
        nextContractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (marketPlaceContract) {
        const transaction = await marketPlaceContract.makeListing(
          tokenId,
          offerPrice
        );
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterMarketPlaceListing({
          tokenId,
          txDetails: { transactionHash, from, to },
          offerPrice,
        })
      );
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const withdrawFromMarketPlace = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.MarketPlaceWithdrawal,
    };

    let receipt: any;

    const contractDetails = {
      abi: MarketPlaceJson.abi,
      address: NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    };

    try {
      const marketPlaceContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (marketPlaceContract) {
        const transaction = await marketPlaceContract.withdrawListing(tokenId);
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterMarketPlaceWithdrawal({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const bidInMarketPlace = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.MarketPlaceOffer,
    };

    let receipt: any;

    const contractDetails = {
      abi: MarketPlaceJson.abi,
      address: NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    };

    try {
      const marketPlaceContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (marketPlaceContract) {
        const transaction = await marketPlaceContract.bid(tokenId, {
          value: 10,
        });
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterMarketPlaceBid({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const acceptInMarketPlace = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.MarketPlaceAccept,
    };

    let receipt: any;

    const contractDetails = {
      abi: MarketPlaceJson.abi,
      address: NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    };

    try {
      const marketPlaceContract = await getContract(
        nextTransaction,
        contractDetails,
        dispatchAfterTxnFailure(nextTransaction)
      );

      if (marketPlaceContract) {
        const transaction = await marketPlaceContract.acceptOffer(tokenId);
        receipt = await transaction.wait();
      }
    } catch (error: any) {
      dispatchAfterTxnFailure(nextTransaction)(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = async () => {
      await dispatch(
        updateDBAfterMarketPlaceAccept({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );
      dispatch(removePendingTransaction(nextTransaction));
    };

    dispatchesUponReceipt(receipt, dispatchAfterSuccess, nextTransaction);
  };

  const enquireExpPointsBalance = async (address: string) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const expPointsContract = new ethers.Contract(
      NEXT_PUBLIC_EXPERIENCE_POINTS_ADDRESS || "",
      ExperiencePointsJson.abi,
      signer
    );

    let result;

    try {
      result = await expPointsContract.balanceOf(address);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    return Number(result);
  };

  const calculateExpPointsClaim = async (address: string) => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const arenaContract = new ethers.Contract(
      NEXT_PUBLIC_ARENA_ADDRESS || "",
      ArenaJson.abi,
      signer
    );

    let result;

    try {
      const score = await arenaContract.gameScores(address);
      const claimed = await arenaContract.userClaimed(address);

      result = Number(score) - Number(claimed);
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return;
    }

    return result;
  };

  return {
    purchaseNFT,
    depositPokemon,
    withdrawPokemon,
    enquirePokePointsBalance,
    calculatePokePointsYield,
    withdrawPokePointsYield,
    enterLuckyDraw,
    listOnMarketPlace,
    withdrawFromMarketPlace,
    bidInMarketPlace,
    acceptInMarketPlace,
    enquireExpPointsBalance,
    calculateExpPointsClaim,
  };
};

export default useWeb3Transactions;
