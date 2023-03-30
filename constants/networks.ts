import { ethers } from "ethers";

import { StaticImageData } from "next/image";
import PolygonIcon from "../public/networks/polygon-network.png";

export enum ChainId {
  MATIC = 137,
  MUMBAI = 80001,
}

export const CONTRACT_LIST = {
  [ChainId.MUMBAI]: {
    FIRE_ROCK_GOLD_ADDRESS: "0xb3170835AfebF0F69dfEE0c70Bf0207E269C0ffe",
    USDC_ADDRESS: "0xaC1922b18bD734C928f6Bb122E51b165049aCd40", // This is Test USD not USDC
  }, //TODO: Update following addresses upon deployment
  [ChainId.MATIC]: {
    // following are testnet addresses, to be replaced with mainnet addresses after deployment
    FIRE_ROCK_GOLD_ADDRESS: "0xb3170835AfebF0F69dfEE0c70Bf0207E269C0ffe",
    USDC_ADDRESS: "0xaC1922b18bD734C928f6Bb122E51b165049aCd40",
  },
};

// Ref: https://docs.uniswap.org/sdk/swap-widget/guides/getting-started#customizing-token-lists
const TOKEN_LIST = {
  [ChainId.MUMBAI]: [
    {
      name: "Test USD",
      address: CONTRACT_LIST[ChainId.MUMBAI].USDC_ADDRESS,
      symbol: "TUSD",
      decimals: 6,
      chainId: ChainId.MUMBAI,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
      name: "Firerock Gold",
      address: CONTRACT_LIST[ChainId.MUMBAI].FIRE_ROCK_GOLD_ADDRESS,
      symbol: "FRG",
      decimals: 18,
      chainId: ChainId.MUMBAI,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      name: "Ethereum",
      address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
      symbol: "WETH",
      decimals: 18,
      chainId: ChainId.MUMBAI,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
  ],
  [ChainId.MATIC]: [
    {
      name: "Test USD",
      address: CONTRACT_LIST[ChainId.MATIC].USDC_ADDRESS,
      symbol: "TUSD",
      decimals: 6,
      chainId: ChainId.MATIC,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
      name: "Firerock Gold",
      address: CONTRACT_LIST[ChainId.MATIC].FIRE_ROCK_GOLD_ADDRESS,
      symbol: "FRG",
      decimals: 18,
      chainId: ChainId.MATIC,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
  ],
};

export interface NETWORK_INFO {
  chainId: ChainId;
  name: string;
  icon: StaticImageData;
  etherscanUrl: string;
  etherscanName: string;
  nativeToken: {
    symbol: string;
    name: string;
    logo: StaticImageData;
    decimal: number;
    minForGas: number;
  };
  rpcUrl: string;
  contracts: Record<string, string>;
  tokenList: {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: ChainId;
    logoURI: string;
  }[];
}

export const maticInfo: NETWORK_INFO = {
  chainId: ChainId.MATIC,
  name: "Polygon Mainnet",
  icon: PolygonIcon,
  etherscanUrl: "https://polygonscan.com",
  etherscanName: "Polygonscan",
  nativeToken: {
    symbol: "MATIC",
    name: "Polygon",
    logo: PolygonIcon,
    decimal: 18,
    minForGas: 10 ** 17,
  },
  rpcUrl: "https://rpc-mainnet.matic.network",
  contracts: CONTRACT_LIST[ChainId.MATIC],
  tokenList: TOKEN_LIST[ChainId.MATIC],
};

export const mumbaiInfo: NETWORK_INFO = {
  chainId: ChainId.MUMBAI,
  name: "Polygon Mumbai Testnet",
  icon: PolygonIcon,
  etherscanUrl: "https://mumbai.polygonscan.com",
  etherscanName: "Polygonscan",
  nativeToken: {
    symbol: "MATIC",
    name: "Polygon",
    logo: PolygonIcon,
    decimal: 18,
    minForGas: 10 ** 16,
  },
  // Public rpc url: https://rpc-mumbai.maticvigil.com
  rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_PROVIDER!,
  contracts: CONTRACT_LIST[ChainId.MUMBAI],
  tokenList: TOKEN_LIST[ChainId.MUMBAI],
};

export const NETWORKS_INFO_CONFIG = {
  [ChainId.MATIC]: maticInfo,
  [ChainId.MUMBAI]: mumbaiInfo,
} as const;

export const NETWORKS = [ChainId.MATIC, ChainId.MUMBAI] as const;

export const providers = NETWORKS.reduce((acc, val) => {
  acc[val] = new ethers.providers.JsonRpcProvider(
    NETWORKS_INFO_CONFIG[val].rpcUrl
  );
  return acc;
}, {} as Record<string, ethers.providers.JsonRpcProvider>);
