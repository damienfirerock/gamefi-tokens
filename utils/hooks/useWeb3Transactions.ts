import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import {
  addPendingTransaction,
  removePendingTransaction,
} from "../../features/TransactionsSlice";
import { updateDBAfterTokenSalePurchase } from "../../features/ProductsSlice";
import { TransactionType } from "../../interfaces/ITransaction";
import useDispatchErrors from "./useDispatchErrors";

const NFTSaleJson = require("../abis/NFTSale.json");
const PokemonCenterJson = require("../abis/PokemonCenter.json");

interface ITransactionCheck {
  nextTransaction: {
    tokenId: number;
    description: string;
    name: string;
    type: TransactionType;
  };
  methodOnFailure: (error: any) => void;
}

const useWeb3Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sendTransactionError, sendTransactionErrorOnMetaMaskRequest } =
    useDispatchErrors();

  const { ethereum } = window as any;

  const runPreTransactionChecks = async (props: ITransactionCheck) => {
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

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS || "",
      NFTSaleJson.abi,
      signer
    );

    let transaction;
    let receipt: any;

    try {
      transaction = await contract.purchaseNFT(tokenId, { value: 5 });
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = () => {
      dispatch(
        updateDBAfterTokenSalePurchase({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );

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

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_POKEMON_CENTER_ADDRESS || "",
      PokemonCenterJson.abi,
      signer
    );

    let transaction;
    let receipt: any;

    try {
      transaction = await contract.deposit(tokenId);
      receipt = await transaction.wait();
    } catch (error: any) {
      dispatchAfterFailure(error);
      return;
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = () => {
      dispatch(
        updateDBAfterTokenSalePurchase({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );

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

  return { purchaseNFT, depositPokemon };
};

export default useWeb3Transactions;
