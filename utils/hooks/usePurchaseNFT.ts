import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import {
  fetchTransactions,
  addPendingTransaction,
  removePendingTransaction,
  setError,
} from "../../features/TransactionsSlice";
import useConnectWallet from "./useConnectWallet";
import { updateDBAfterTokenSalePurchase } from "../../features/ProductsSlice";
import { TransactionType } from "../../interfaces/ITransaction";

const NFTSaleJson = require("../abis/NFTSale.json");

const usePurchaseNFT = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account } = useConnectWallet();

  const { ethereum } = window as any;

  const provider = new ethers.providers.Web3Provider(ethereum, "any");

  const purchaseNFT = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    if (!window || !provider) return;

    const nextTransaction = {
      tokenId,
      description,
      name,
      type: TransactionType.TokenSalePurchase,
    };

    dispatch(addPendingTransaction(nextTransaction));

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const walletAddress = accounts[0]; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS || "",
      NFTSaleJson.abi,
      signer
    );

    let transaction;
    let receipt;

    try {
      transaction = await contract.purchaseNFT(tokenId, { value: 5 });
      receipt = await transaction.wait();
    } catch (error: any) {
      const { code, reason, message } = error;

      if (code && reason) {
        dispatch(setError(`${code}: ${reason}`));
      } else if (message) {
        dispatch(setError(message));
      } else {
        dispatch(setError(error));
      }
    }

    const { transactionHash, from, to } = receipt || {};

    const dispatchAfterSuccess = () => {
      dispatch(
        updateDBAfterTokenSalePurchase({
          tokenId,
          txDetails: { transactionHash, from, to },
        })
      );
      // walletAddress is lower case
      // either have to send all addresses to be saved in lower-case
      // or use regex to find transactions in Mongo side
      dispatch(fetchTransactions(account || ""));
      dispatch(removePendingTransaction(nextTransaction));
    };

    const dispatchAfterFailure = () => {
      dispatch(removePendingTransaction(nextTransaction));
    };

    // await setTimeout(() => {
    if (receipt) {
      dispatchAfterSuccess();
    } else {
      dispatchAfterFailure();
    }
    // }, 10000);}
  };

  return { purchaseNFT };
};

export default usePurchaseNFT;
