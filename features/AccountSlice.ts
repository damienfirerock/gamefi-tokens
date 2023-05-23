import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  walletFRGBalance: number | null;
  walletMaticBalance: number | null;
  frgCrystalBalance: number | null;
  pendingFrgCrystalBalance: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  walletFRGBalance: null,
  walletMaticBalance: null,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWalletMaticBalance: (state, action) => {
      state.walletMaticBalance = action.payload;
    },
    setWalletFRGBalance: (state, action) => {
      state.walletFRGBalance = action.payload;
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
  setLoading,
  setWalletMaticBalance,
  setWalletFRGBalance,
  setFrgCrystalBalance,
  setPendingFrgCrystalBalance,
} = AccountSlice.actions;

export default AccountSlice.reducer;
