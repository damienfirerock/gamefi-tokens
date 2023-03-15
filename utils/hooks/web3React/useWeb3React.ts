import { Web3Provider } from "@ethersproject/providers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useCallback } from "react";

import { ChainId } from "../../../constants/networks";
import { chainId as envChainId } from "../../../constants/connectors";
import { providers } from "../../../constants/networks";

export function useWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: ChainId;
} {
  const {
    chainId,
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
    localStorage.removeItem("isWalletConnected");
    return deactivate();
  }, [deactivate]);

  return {
    connector,
    library: library || providers[chainId || envChainId],
    chainId: chainId || envChainId || ChainId.MATIC,
    account,
    active,
    error,
    activate: activateWrapped,
    setError,
    deactivate: deactivateWrapped,
  } as Web3ReactContextInterface;
}

export default useWeb3React;
