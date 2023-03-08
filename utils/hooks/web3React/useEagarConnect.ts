import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { injected } from "../../../constants/connectors";

import { NETWORKS_INFO_CONFIG, NETWORKS } from "../../../constants/networks";
import useWeb3React from "./useWeb3React";

export const providers = NETWORKS.reduce((acc, val) => {
  acc[val] = new ethers.providers.JsonRpcProvider(
    NETWORKS_INFO_CONFIG[val].rpcUrl
  );
  return acc;
}, {} as Record<string, ethers.providers.JsonRpcProvider>);

async function isAuthorized(): Promise<boolean> {
  if (!window.ethereum) {
    return false;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts?.length > 0) return true;
    return false;
  } catch {
    return false;
  }
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    try {
      isAuthorized()
        .then((isAuthorized) => {
          setTried(true);
          if (isAuthorized) {
            activate(injected, undefined, true);
          } else if (isMobile && window.ethereum) {
            activate(injected, undefined, true);
          }
        })
        .catch((e) => {
          console.log("Eagerly connect: authorize error", e);
          setTried(true);
        });
    } catch (e) {
      console.log("Eagerly connect: authorize error", e);
      setTried(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

export default useEagerConnect;
