import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

import CONFIG from "../../../config";

const CharacterSkinJson = require("../../../constants/abis/CharacterSkin.json");

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type NextRequestBody = {
  paymentData: google.payments.api.PaymentData;
  account: string;
  contract: string;
  tokenId: string;
};

type NextRequest = Override<NextApiRequest, { body: NextRequestBody }>;

const {
  ALCHEMY_WEB_SOCKET_PROVIDER,
  CHARACTER_SKIN_ADDRESS,
  DUMMY_KEY,
  NETWORK_CHAIN_ID,
} = CONFIG;

const handleGooglePay = async (req: NextRequest, res: NextApiResponse) => {
  console.log({
    ALCHEMY_WEB_SOCKET_PROVIDER,
    CHARACTER_SKIN_ADDRESS,
    DUMMY_KEY,
    NETWORK_CHAIN_ID,
  });
  try {
    const { paymentData, account, contract, tokenId } = req.body;
    // TODO: Check if valid address and tokenId
    // TODO: Check payment data with third party
    console.log("Server API to handle successful Google Pay...");

    // If valid, mint nft
    const provider = await new ethers.providers.WebSocketProvider(
      ALCHEMY_WEB_SOCKET_PROVIDER!
    );
    const signer = new ethers.Wallet(DUMMY_KEY!, provider);

    const characterSkinNftContract = new ethers.Contract(
      CHARACTER_SKIN_ADDRESS!,
      CharacterSkinJson.abi,
      signer
    );

    // Get Transaction Details
    const estimatedGasLimit = await characterSkinNftContract.estimateGas.mint(
      account,
      tokenId,
      1,
      []
    );
    const unsignedTransaction =
      await characterSkinNftContract.populateTransaction.mint(
        account,
        tokenId,
        1,
        []
      );
    unsignedTransaction.chainId = parseInt(NETWORK_CHAIN_ID!);
    unsignedTransaction.gasLimit = estimatedGasLimit;
    unsignedTransaction.gasPrice = await provider.getGasPrice();

    // Send transaction
    const walletAddress = await signer.getAddress();
    unsignedTransaction.nonce = await provider.getTransactionCount(
      walletAddress
    );
    const approveTxSigned = await signer.signTransaction(unsignedTransaction);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    // The free plan on Vercel has a 10 second time-out
    // As such, waiting for 10 blocks would cause a false positive error
    // HOTFIX: Wait 15 seconds on client-side (~3 seconds per block)
    // Alternative: ping blockchain on clientside until a positive result is received
    const approveReceipt = await submittedTx.wait();

    if (approveReceipt.status === 0) {
      res.status(500).json({
        success: false,
        error: "Approve Transaction Failed",
      });
    }

    res.status(200).json({
      success: true,
      txnHash: approveReceipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: `Internal Server Error` });
  }
};

export default handleGooglePay;
