import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
  error?: null | string;
  loading: boolean;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
};

export const TransactionSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {},
});

export const { setError, clearError } = TransactionSlice.actions;

export default TransactionSlice.reducer;
