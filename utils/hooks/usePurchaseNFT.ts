import { useState, useEffect } from "react";
import { ethers } from "ethers";

const NFTSaleJson = require("../abis/NFTSale.json");

const usePurchaseNFT = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseNFT = async (tokenId: number) => {
    if (!window) return;

    setPending(true);

    const { ethereum } = window as any;

    const provider = new ethers.providers.Web3Provider(ethereum, "any");

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

    const transaction = await contract.purchaseNFT(tokenId, { value: 5 });
    const receipt = await transaction.wait();
    console.log({ receipt });

    setPending(false);
  };

  return { error, pending, purchaseNFT };
};

export default usePurchaseNFT;
