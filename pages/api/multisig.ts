const ethers = require("ethers");

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import CONFIG from "../../config";

const MultiSigWalletJson = require("../../utils/abis/MultiSigWallet.json");

const { ALCHEMY_WEB_SOCKET_PROVIDER, MULTI_SIG_ADDRESS, DUMMY_KEY } = CONFIG;

export enum MultiSigTxnType {
  CONFIRM = "Confirm",
  REVOKE = "Revoke",
  EXECUTE = "Execute",
}

type Data = {
  success: boolean;
  error?: any;
};

type Payload = {
  txIndex: number;
  address: string;
  nonce: number;
  signature: string;
  type: MultiSigTxnType;
};

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type CustomApiRequest = Override<NextApiRequest, { body: Payload }>;

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ success: true });
      break;
    case "POST":
      try {
        // Set up
        const provider = await new ethers.providers.WebSocketProvider(
          ALCHEMY_WEB_SOCKET_PROVIDER!
        );
        const signer = new ethers.Wallet(DUMMY_KEY!, provider);
        const multiSigContract = new ethers.Contract(
          MULTI_SIG_ADDRESS!,
          MultiSigWalletJson.abi,
          signer
        );

        const { txIndex, address, nonce, signature, type } = req.body;
        const { chainId } = await provider.getNetwork();

        // Verify Signature
        const verification = await multiSigContract.verify(
          nonce,
          txIndex,
          address,
          signature
        );

        if (!verification) {
          res.status(401).json({
            success: false,
            error: "Unauthorised",
          });
        }

        // Populate transaction
        let estimatedGasLimit;
        let unsignedTransaction;

        if (type === MultiSigTxnType.CONFIRM) {
          estimatedGasLimit =
            await multiSigContract.estimateGas.confirmTransactionOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );

          unsignedTransaction =
            await multiSigContract.populateTransaction.confirmTransactionOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );
        } else if (type === MultiSigTxnType.REVOKE) {
          estimatedGasLimit =
            await multiSigContract.estimateGas.revokeConfirmationOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );

          unsignedTransaction =
            await multiSigContract.populateTransaction.revokeConfirmationOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );
        } else if (type === MultiSigTxnType.EXECUTE) {
          estimatedGasLimit =
            await multiSigContract.estimateGas.executeTransactionOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );

          unsignedTransaction =
            await multiSigContract.populateTransaction.executeTransactionOnBehalf(
              nonce,
              txIndex,
              address,
              signature
            );
        }

        unsignedTransaction.chainId = chainId;
        unsignedTransaction.gasLimit = estimatedGasLimit;
        unsignedTransaction.gasPrice = await provider.getGasPrice();

        // Send transaction
        const walletAddress = await signer.getAddress();
        unsignedTransaction.nonce = await provider.getTransactionCount(
          walletAddress
        );

        const approveTxSigned = await signer.signTransaction(
          unsignedTransaction
        );

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
        });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: `Internal Server Error` });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res
        .status(405)
        .json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
}
