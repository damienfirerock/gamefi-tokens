import { StaticImageData } from "next/image";
import PolygonIcon from "../public/networks/polygon-network.png";

export enum ChainId {
  MATIC = 137,
  MUMBAI = 80001,
}

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
  contracts: {
    // following are testnet addresses, to be replaced with mainnet addresses after deployment
    FIRE_ROCK_GOLD_ADDRESS: "0xb3170835AfebF0F69dfEE0c70Bf0207E269C0ffe",
    SINGLE_USE_MERKLE_AIRDROP_ADDRESS:
      "0x4e66c6eD3663dd18271619883bb1A182631993E1",
    CUMULATIVE_MERKLE_AIRDROP_ADDRESS:
      "0xE2600e71a45e507d84525CD0003bcA32DfB2acF8",
  },
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
  contracts: {
    FIRE_ROCK_GOLD_ADDRESS: "0xb3170835AfebF0F69dfEE0c70Bf0207E269C0ffe",
    SINGLE_USE_MERKLE_AIRDROP_ADDRESS:
      "0x4e66c6eD3663dd18271619883bb1A182631993E1",
    CUMULATIVE_MERKLE_AIRDROP_ADDRESS:
      "0xE2600e71a45e507d84525CD0003bcA32DfB2acF8",
  },
};

export const NETWORKS_INFO_CONFIG = {
  [ChainId.MATIC]: maticInfo,
  [ChainId.MUMBAI]: mumbaiInfo,
} as const;

export const NETWORKS = [ChainId.MATIC, ChainId.MUMBAI] as const;
