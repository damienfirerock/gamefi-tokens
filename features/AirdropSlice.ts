import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  hasClaimed: boolean;
  merkleRoot: string | null;
  walletBalance: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  hasClaimed: false,
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
    setMerkleRoot: (state, action) => {
      state.merkleRoot = action.payload;
    },
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { clearError, setHasClaimed, setMerkleRoot, setWalletBalance } =
  AirdropSlice.actions;

export default AirdropSlice.reducer;
