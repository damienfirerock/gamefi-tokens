import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  hasClaimed: boolean;
  pastClaimed: number;
  merkleRoot: string | null;
  walletBalance: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  hasClaimed: false,
  pastClaimed: 0,
  merkleRoot: null,
  walletBalance: null,
  error: null,
  loading: false,
  data: null,
};

export const AirdropSlice = createSlice({
  name: "Airdrop",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setHasClaimed: (state, action) => {
      state.hasClaimed = action.payload;
    },
    setPastClaimed: (state, action) => {
      state.pastClaimed = action.payload;
    },
    setMerkleRoot: (state, action) => {
      state.merkleRoot = action.payload;
    },
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  clearError,
  setHasClaimed,
  setPastClaimed,
  setMerkleRoot,
  setWalletBalance,
} = AirdropSlice.actions;

export default AirdropSlice.reducer;
