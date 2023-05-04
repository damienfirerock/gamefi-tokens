import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  IUserTransaction,
  ISignatureDetails,
} from "../interfaces/ITransaction";

const ENDPOINT = "/api/payment/googlePay";

type SliceState = {
  txCount: number;
  txIndex: number;
  txnHash: string | null;
  confirmationsRequired: number;
  sigDetails: ISignatureDetails | null;
  txnDetails: IUserTransaction | null;
  error?: null | string;
  success?: null | string;
  loading: boolean;
};

export const submitGooglePayDataForMint = createAsyncThunk(
  "get/submitGooglePayDataForMint",
  async (props: {
    paymentData: google.payments.api.PaymentData;
    account: string;
    contract: string;
    tokenId: number;
  }) => {
    const body = JSON.stringify(props);

    const response: {
      success: boolean;
      txnHash?: string;
      error?: any;
    } = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    return response.txnHash || null;
  }
);

// First approach: define the initial state using that type
const initialState: SliceState = {
  txCount: 0,
  txIndex: 0,
  txnHash: null,
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
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.error = null;
    },
    setTxnCount: (state, action) => {
      state.txCount = action.payload;
    },
    setTxnIndex: (state, action) => {
      state.txIndex = action.payload;
    },
    setTxnHash: (state, action) => {
      state.txnHash = action.payload;
    },
    clearTxnHash: (state) => {
      state.txnHash = null;
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
  extraReducers: (builder) => {
    builder.addCase(submitGooglePayDataForMint.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitGooglePayDataForMint.fulfilled, (state, action) => {
      state.loading = false;
      state.txnHash = action.payload;
    });
    builder.addCase(submitGooglePayDataForMint.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setSuccess,
  clearSuccess,
  setTxnCount,
  setTxnIndex,
  setTxnHash,
  clearTxnHash,
  setConfirmationsRequired,
  setTxnDetails,
  setSigDetails,
} = TransactionSlice.actions;

export default TransactionSlice.reducer;
