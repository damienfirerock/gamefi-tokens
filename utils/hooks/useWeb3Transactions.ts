import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import useDispatchErrors from "./useDispatchErrors";

import { setDecimals } from "../../features/DecodedDataSlice";

const ERC20ABI = require("../abis/ERC20-ABI.json");

const useWeb3Transactions = () => {
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

  const getTokenDecimals = async (address: string): Promise<number> => {
    const { signer } = (await runPreChecks()) || {};

    if (!signer) return 0;

    const ERC20Contract = new ethers.Contract(address, ERC20ABI, signer);

    let result;

    try {
      result = await ERC20Contract.decimals();
      dispatch(setDecimals(result));
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return 0;
    }

    return Number(result);
  };

  return {
    getTokenDecimals,
  };
};

export default useWeb3Transactions;
