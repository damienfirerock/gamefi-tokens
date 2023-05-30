// https://www.gimtec.io/articles/process-is-not-defined/

const XY3_BACKEND_URL = process.env.NEXT_PUBLIC_XY3_BACKEND_URL;
const NEXTAUTH_SECRET = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;

// Chain ID
const NETWORK_CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID;
// The following is in hexidecimal representation
const HEXADECIMAL_CHAIN_ID =
  "0x" + parseInt(NETWORK_CHAIN_ID!, 10).toString(16);

// Contract Addresses
const FIRE_ROCK_TOKEN = process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

// PolygonScan URL
const POLYGONSCAN_URL = process.env.NEXT_PUBLIC_POLYGONSCAN_URL;

// Alchemy Web Socket Provider
const ALCHEMY_WEB_SOCKET_PROVIDER =
  process.env.NEXT_PUBLIC_ALCHEMY_WEB_SOCKET_PROVIDER;

// Dummy Key
const DUMMY_KEY = process.env.NEXT_PUBLIC_DUMMY_KEY;

export const CONTRACT_ADDRESSES = {
  FIRE_ROCK_TOKEN,
};

const CONFIG = {
  ...CONTRACT_ADDRESSES,
  NETWORK_CHAIN_ID,
  HEXADECIMAL_CHAIN_ID,
  POLYGONSCAN_URL,
  ALCHEMY_WEB_SOCKET_PROVIDER,
  DUMMY_KEY,
  XY3_BACKEND_URL,
  NEXTAUTH_SECRET,
};

export const ADDRESS_NAMES: Record<string, string> = {};

ADDRESS_NAMES[CONTRACT_ADDRESSES.FIRE_ROCK_TOKEN!] = "FireRock Token";

export default CONFIG;
