import { Web3Provider } from "@ethersproject/providers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { ethers } from "ethers";
import { useCallback } from "react";

import { ChainId } from "../../../constants/networks";
import { chainId } from "../../../constants/connectors";
import { NETWORKS_INFO_CONFIG, NETWORKS } from "../../../constants/networks";

export const providers = NETWORKS.reduce((acc, val) => {
  acc[val] = new ethers.providers.JsonRpcProvider(
    NETWORKS_INFO_CONFIG[val].rpcUrl
  );
  return acc;
}, {} as Record<string, ethers.providers.JsonRpcProvider>);

export function useWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: ChainId;
} {
  const {
    connector,
    library,
    account,
    active,
    error,
    activate,
    setError,
    deactivate,
  } = useWeb3ReactCore();

  const activateWrapped = useCallback(
    (
      connector: AbstractConnector,
      onError?: (error: Error) => void,
      throwErrors?: boolean
    ) => {
      return activate(connector, onError, throwErrors);
    },
    [activate]
  );
  const deactivateWrapped = useCallback(() => {
    return deactivate();
  }, [deactivate]);
  return {
    connector,
    library: library || providers[chainId],
    chainId: chainId || ChainId.MATIC,
    account,
    active,
    error,
    activate: activateWrapped,
    setError,
    deactivate: deactivateWrapped,
  } as Web3ReactContextInterface;
}

export default useWeb3React;
