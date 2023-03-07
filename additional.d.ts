interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isBraveWallet?: any;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    request: (params: { method: string; params?: any }) => Promise<any>;
    selectedProvider?: {
      isMetaMask: boolean;
    };
    providers?: any[];
  };
}

interface Navigator {
  brave?: {
    isBrave: () => Promise<boolean | undefined>;
  };
}
