import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  walletBalance: number | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  walletBalance: null,
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
  },
  extraReducers: (builder) => {},
});

export const { clearError, setWalletBalance } = AccountSlice.actions;

export default AccountSlice.reducer;
