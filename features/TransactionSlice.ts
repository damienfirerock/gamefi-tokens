import { createSlice } from "@reduxjs/toolkit";

import {
  IUserTransaction,
  ISignatureDetails,
} from "../interfaces/ITransaction";

type SliceState = {
  isOwner: boolean;
  txCount: number;
  txIndex: number;
  confirmationsRequired: number;
  sigDetails: ISignatureDetails | null;
  txnDetails: IUserTransaction | null;
  error?: null | string;
  loading: boolean;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  isOwner: false,
  txCount: 0,
  txIndex: 0,
  confirmationsRequired: 0,
  sigDetails: null,
  txnDetails: null,
  error: null,
  loading: false,
};

export const TransactionSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    setTxnCount: (state, action) => {
      state.txCount = action.payload;
    },
    setTxnIndex: (state, action) => {
      state.txIndex = action.payload;
    },
    setConfirmationsRequired: (state, action) => {
      state.confirmationsRequired = action.payload;
    },
    setTxnDetails: (state, action) => {
      state.txnDetails = action.payload;
    },
    setSigDetails: (state, action) => {
      state.sigDetails = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setLoading,
  setError,
  clearError,
  setIsOwner,
  setTxnCount,
  setTxnIndex,
  setConfirmationsRequired,
  setTxnDetails,
  setSigDetails,
} = TransactionSlice.actions;

export default TransactionSlice.reducer;
