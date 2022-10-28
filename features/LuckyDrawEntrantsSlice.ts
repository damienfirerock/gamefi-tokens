import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const LuckyDrawJson = require("../utils/abis/LuckyDraw.json");

interface ILuckyDrawEntrantFilter {
  owner?: string;
}

export const fetchLuckyDrawEntrants = createAsyncThunk(
  "post/fetchLuckyDrawEntrants",
  async (payload?: ILuckyDrawEntrantFilter) => {
    const { ethereum } = window as any;

    const provider = new ethers.providers.Web3Provider(ethereum, "any");

    let walletAddress;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    walletAddress = accounts[0]; // first account in MetaMask

    const { chainId } = await provider.getNetwork();

    if (chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "")) {
      throw new Error("Please switch to Goerli network");
      return;
    }

    const signer = provider.getSigner(walletAddress);

    if (!signer) return; // errors should be caught in runPreTransactionChecks

    const luckyDrawContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_LUCKY_DRAW_ADDRESS || "",
      LuckyDrawJson.abi,
      signer
    );

    const result = await luckyDrawContract.getPlayers();

    return result;
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: string[] | null;
};

const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const LuckyDrawEntrantsSlice = createSlice({
  name: "LuckyDrawEntrants",
  initialState,
  reducers: {
    clearLuckyDrawEntrants: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetching LuckyDrawEntrants after Search
    builder.addCase(fetchLuckyDrawEntrants.pending, (state) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLuckyDrawEntrants.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLuckyDrawEntrants.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearLuckyDrawEntrants } = LuckyDrawEntrantsSlice.actions;

export default LuckyDrawEntrantsSlice.reducer;
