import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  walletBalance: number | null;
  frgCrystalBalance: number | null;
  pendingFrgCrystalBalance: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  walletBalance: null,
  frgCrystalBalance: 99999,
  pendingFrgCrystalBalance: 0,
  error: null,
  loading: false,
  data: null,
};

export const AccountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
    setFrgCrystalBalance: (state, action) => {
      state.frgCrystalBalance = action.payload;
    },
    setPendingFrgCrystalBalance: (state, action) => {
      state.pendingFrgCrystalBalance = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  clearError,
  setWalletBalance,
  setFrgCrystalBalance,
  setPendingFrgCrystalBalance,
} = AccountSlice.actions;

export default AccountSlice.reducer;
