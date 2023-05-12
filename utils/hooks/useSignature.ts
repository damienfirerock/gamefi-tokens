import { useMemo } from "react";
import { ethers } from "ethers";
import useWeb3React from "./web3React/useWeb3React";
import { sequence } from "0xsequence";

import { providers } from "../../constants/networks";
import { getContract } from "../web3";
import useDispatchErrors from "./useDispatchErrors";

const SignaturesJson = require("../../constants/abis/Signatures.json");
const IERC1271Json = require("../../constants/abis/IERC1271.json");

export const useActivationWallet = () => {
  const { account, chainId, library } = useWeb3React();
  const { sendTransactionErrorOnMetaMaskRequest } = useDispatchErrors();

  const SignaturesContract = useMemo(() => {
    if (!library || !account) {
      return null;
    }

    return getContract(
      process.env.NEXT_PUBLIC_SIGNATURES_LIBRARY_ADDRESS!,
      SignaturesJson.abi,
      library,
      account
    );
  }, [library, account]);

  const checkIfSmartContract = async () => {
    if (!account || !chainId) return false;

    const provider = providers[chainId];
    const bytecode = await provider.getCode(account);

    return bytecode && ethers.utils.hexStripZeros(bytecode) !== "0x";
  };

  const getMessageHash = (email: string, address: string) => {
    // equivalent of keccak256(abi.encodePacked(email, address));
    const hash = ethers.utils.solidityKeccak256(
      ["string", "address"],
      [email, address]
    );

    return hash;
  };

  // Verifying the signature is easier with smart contract
  // See: https://github.com/authereum/is-valid-signature/blob/master/lib/index.js

  const checkSignature = async (email: string) => {
    try {
      if (!SignaturesContract || !account || !library)
        throw Error("Invalid Method");

      const signer = library.getSigner();

      if (await checkIfSmartContract()) {
        const signature = await signer.signMessage(email);

        const response = await sequence.utils.isValidMessageSignature(
          account,
          email,
          signature,
          library,
          chainId
        );

        return response;
      } else {
        const hash = await SignaturesContract.getMessageHash(email, account);
        const signature = await signer.signMessage(ethers.utils.arrayify(hash));

        const response = await SignaturesContract.verify(
          email,
          account,
          signature
        );

        return response;
      }
    } catch (error: any) {
      sendTransactionErrorOnMetaMaskRequest(error);
      return false;
    }
  };

  return { checkIfSmartContract, getMessageHash, checkSignature };
};

export default useActivationWallet;
