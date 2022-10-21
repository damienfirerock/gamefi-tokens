import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IProduct } from "../interfaces/IProduct";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/deposits";

interface IDepositFilter {
  owner?: string;
}

// Deposits endpoint searches for deposits, but will link back to product details via tokenId
const sortDepositsByDescription = (array: IProduct[]) => {
  const nextArray = array.sort(
    (a, b) => parseInt(a.description) - parseInt(b.description)
  );

  return nextArray;
};

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

export const abortFetchDeposits = () => {
  abortController.abort(); // cancel previous request
  abortController = new abortControllerObj();
};

export const fetchDeposits = createAsyncThunk(
  "post/fetchDeposits",
  async (payload?: IDepositFilter) => {
    abortController.abort(); // cancel previous request
    abortController = abortControllerObj && new abortControllerObj();

    const body = JSON.stringify(payload);

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        signal: abortControllerObj && abortController.signal,
        headers: { "content-type": "application/json" },
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    if (response.data?.length) {
      return sortDepositsByDescription(response.data);
    }

    return response.data;
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: IProduct[] | null;
};

const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const DepositsSlice = createSlice({
  name: "Deposits",
  initialState,
  reducers: {
    clearDeposits: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetching Deposits after Search
    builder.addCase(fetchDeposits.pending, (state) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeposits.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchDeposits.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearDeposits } = DepositsSlice.actions;

export default DepositsSlice.reducer;
