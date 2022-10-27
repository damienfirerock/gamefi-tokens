import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IProduct } from "../interfaces/IProduct";

import { sortProductsByDescription } from "../utils/common";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/deposits";

interface IDepositFilter {
  owner?: string;
}

export const fetchDeposits = createAsyncThunk(
  "post/fetchDeposits",
  async (payload?: IDepositFilter) => {
    const body = JSON.stringify(payload);

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
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
      return sortProductsByDescription(response.data);
    }

    return response.data;
  }
);

export const updateDBAfterPokemonCenterDeposit = createAsyncThunk(
  "get/updateDBAfterPokemonCenterDeposit",
  async (props: {
    tokenId: number;
    txDetails: { transactionHash: string; from: string; to: string };
  }) => {
    const { tokenId, txDetails } = props;
    const body = JSON.stringify({ tokenId, txDetails });

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/add` || "",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    const nextBody = JSON.stringify({ owner: txDetails.from });

    const nextResponse: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: nextBody,
      }
    ).then((res) => res.json());
    if (nextResponse.error) return Promise.reject(nextResponse.error);

    if (nextResponse.data?.length) {
      return sortProductsByDescription(nextResponse.data);
    }

    return nextResponse.data;
  }
);

export const updateDBAfterPokemonCenterWithdrawal = createAsyncThunk(
  "get/updateDBAfterPokemonCenterWithdrawal",
  async (props: {
    tokenId: number;
    txDetails: { transactionHash: string; from: string; to: string };
  }) => {
    const { tokenId, txDetails } = props;
    const body = JSON.stringify({ tokenId, txDetails });

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/remove` || "",
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body,
      }
    ).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    const nextBody = JSON.stringify({ owner: txDetails.from });

    const nextResponse: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: nextBody,
      }
    ).then((res) => res.json());

    if (nextResponse.error) return Promise.reject(nextResponse.error);

    if (nextResponse.data?.length) {
      return sortProductsByDescription(nextResponse.data);
    }

    return nextResponse.data;
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
    builder.addCase(updateDBAfterPokemonCenterDeposit.pending, (state) => {
      // Runs 'silently'
    });
    builder.addCase(
      updateDBAfterPokemonCenterDeposit.fulfilled,
      (state, action: { payload: IProduct[] }) => {
        state.data = action.payload;
      }
    );
    builder.addCase(
      updateDBAfterPokemonCenterDeposit.rejected,
      (state, action) => {
        state.error = action.error.message;
      }
    );
    builder.addCase(updateDBAfterPokemonCenterWithdrawal.pending, (state) => {
      // Runs 'silently'
    });
    builder.addCase(
      updateDBAfterPokemonCenterWithdrawal.fulfilled,
      (state, action: { payload: IProduct[] }) => {
        state.data = action.payload;
      }
    );
    builder.addCase(
      updateDBAfterPokemonCenterWithdrawal.rejected,
      (state, action) => {
        state.error = action.error.message;
      }
    );
  },
});

export const { clearDeposits } = DepositsSlice.actions;

export default DepositsSlice.reducer;
