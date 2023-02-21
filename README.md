This is a small repo to demonstrate how to claim from a Merkle Airdrop Smart Contract from the frontend.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sample env file

```
# Mumbai
NEXT_PUBLIC_POLYGONSCAN_URL='https://mumbai.polygonscan.com/address/'
NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS='0xb3170835AfebF0F69dfEE0c70Bf0207E269C0ffe'
NEXT_PUBLIC_SINGLE_USE_MERKLE_AIRDROP_ADDRESS='0x4e66c6eD3663dd18271619883bb1A182631993E1'
NEXT_PUBLIC_OWNER_ADDRESS_1='0x2F8C6C5D12391F8D6AcE02A63a579f391F04b40f'
NEXT_PUBLIC_OWNER_ADDRESS_2='0xF9ee7f3e841B98Eb6895a2905564F50bcfA39DfB'
NEXT_PUBLIC_OWNER_ADDRESS_3='0xe2A2C2bB5014Ed1922F0c93f30CAd1e3af0ed60B'
NEXT_PUBLIC_OWNER_ADDRESS_4='0x9fCCaf1654B0fA5DBBf2A40617a3CAF952Db166D'
NEXT_PUBLIC_OWNER_ADDRESS_5='0x6F5744B20A60A3A6aCF73bfBee6C2BaCE4Ed1140'
NEXT_PUBLIC_OWNER_ADDRESS_6='0x75B59c086D31B4c8BbbD26DA29B1100c2928410A'
NEXT_PUBLIC_OWNER_ADDRESS_7='0xDEcaEFb18B535cAEEd79B36EE5D4F6ba06F5756B'

NEXT_PUBLIC_NETWORK_CHAIN_ID=80001
# 31337 (HardHat)
# 80001 (Polygon Mumbai)


NEXT_PUBLIC_DUMMY_KEY=<PRIVATE KEY>

NEXT_PUBLIC_ALCHEMY_WEB_SOCKET_PROVIDER=<From Alchemy Account>

```

## Packages used

- Material UI (https://mui.com/) for quick styling (MUI used emotion as a dependency)
- Redux (specifically https://redux-toolkit.js.org/) for global state management
- ethersjs (https://docs.ethers.org/v5/) to read blockchain data, work with browser wallets, and submit transactions to the network
- 0xsequence (https://docs.sequence.xyz/quickstart) as an browser wallet which should hopefully remove the need for a browser extension wallet

## Global State Management

- Airdrop Slice

## Frontend

- This is a very simple app with only one main page (Airdrop.tsx)
