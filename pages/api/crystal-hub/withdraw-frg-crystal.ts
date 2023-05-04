import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

import CONFIG from "../../../config";

const FireRockGoldJson = require("../../../constants/abis/FireRockGold.json");

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type NextRequestBody = {
  account: string;
  amount: number; // By right should submit frg crystal amt for verification at backend, but this is just a mock endpoint
};

type NextRequest = Override<NextApiRequest, { body: NextRequestBody }>;

const {
  ALCHEMY_WEB_SOCKET_PROVIDER,
  DUMMY_KEY,
  NETWORK_CHAIN_ID,
  FIRE_ROCK_TOKEN,
} = CONFIG;

const handleWithdrawFRGCrystal = async (
  req: NextRequest,
  res: NextApiResponse
) => {
  try {
    const { account, amount } = req.body;

    const provider = new ethers.providers.WebSocketProvider(
      ALCHEMY_WEB_SOCKET_PROVIDER!
    );

    const signer = new ethers.Wallet(DUMMY_KEY!, provider);

    const fireRockGoldContract = new ethers.Contract(
      FIRE_ROCK_TOKEN!,
      FireRockGoldJson.abi,
      signer
    );

    const nextAmount = ethers.utils.parseEther(amount.toString());

    // Get Transaction Details
    const estimatedGasLimit = await fireRockGoldContract.estimateGas.transfer(
      account,
      nextAmount
    );

    const unsignedTransaction =
      await fireRockGoldContract.populateTransaction.transfer(
        account,
        nextAmount
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
    console.log(error);
    res.status(500).json({ success: false, error: `Internal Server Error` });
  }
};

export default handleWithdrawFRGCrystal;
