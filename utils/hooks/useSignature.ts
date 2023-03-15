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

      // let messageHash = ethers.utils.solidityKeccak256(["string"], [email]);
      // let messageHashBinary = ethers.utils.arrayify(messageHash);

      const signer = library.getSigner();

      if (await checkIfSmartContract()) {
        //--------------//
        // const hash = await ethers.utils.solidityKeccak256(["string"], [email]);
        // const nextHash = ethers.utils.arrayify(hash);
        // const signature = await signer.signMessage(nextHash);
        //--------------//

        const signature = await signer.signMessage(email);

        // FIXME: Clarify with Sequence Team if this approach is possible
        // sequence.utils.isValidMessageSignature works with normal message
        // https://docs.sequence.xyz/quickstart
        // Not able to get sequence.utils.isValidSignature working with hash

        //--------------//
        // const IERC1271Contract = getContract(
        //   account,
        //   IERC1271Json.abi,
        //   library,
        //   account
        // );

        // const test = await IERC1271Contract.isValidSignature(
        //   nextHash,
        //   signature
        // );

        // console.log({ test });
        //--------------//

        //--------------//
        // const response = await sequence.utils.isValidSignature(
        //   account,
        //   nextHash,
        //   signature,
        //   library,
        //   chainId
        // );
        //--------------//

        const response = await sequence.utils.isValidMessageSignature(
          account,
          email,
          signature,
          library,
          chainId
        );
        console.log({ response });

        return response;
      } else {
        // TODO: Update Signatures SC after clarification with Sequence Team
        // verify the message for an externally owned account (EOA)

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
