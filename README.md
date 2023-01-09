This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
NEXT_PUBLIC_BACKEND_URL=

NEXT_PUBLIC_NETWORK_CHAIN_ID=80001
```

## Packages used

- Material UI (https://mui.com/) for quick styling (MUI used emotion as a dependency)
- Redux (specifically https://redux-toolkit.js.org/) for global state management
- ethersjs (https://docs.ethers.org/v5/) to read blockchain data, work with browser wallets, and submit transactions to the network
- 0xsequence (https://docs.sequence.xyz/quickstart) as an browser wallet which should hopefully remove the need for a browser extension wallet
