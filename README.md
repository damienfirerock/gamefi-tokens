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
