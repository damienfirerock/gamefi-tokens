import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ITransaction } from "../interfaces/ITransaction";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/transactions";

// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
let abortController: any;
let abortControllerObj: any;
// Check for process.browser to prevent window error
// https://stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
// Also check if AbortController is present in client browser
if (process.browser && AbortController) {
  abortControllerObj = AbortController;
  abortController = new AbortController();
}

export const abortFetchTransactions = () => {
  abortController.abort(); // cancel previous request
  abortController = new abortControllerObj();
};

export const fetchTransactions = createAsyncThunk(
  "get/fetchTransactions",
  async (address: string) => {
    abortController.abort(); // cancel previous request
    abortController = abortControllerObj && new abortControllerObj();

    const body = JSON.stringify({ address });

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        signal: abortControllerObj && abortController.signal,
        headers: new Headers({ "content-type": "application/json" }),
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    return response.data;
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: ITransaction[] | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const TransactionsSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.data = null;
      state.error = null;
      state.loading = false;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
  },
  extraReducers: (builder) => {
    // Fetching Transactions after Search
    builder.addCase(fetchTransactions.pending, (state) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearTransactions, toggleLoading } = TransactionsSlice.actions;

export default TransactionsSlice.reducer;
