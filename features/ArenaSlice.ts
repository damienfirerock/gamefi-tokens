import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { PokemonType, ArenaOutcome } from "../interfaces/IArena";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;

const ENDPOINT = "/api/v1/arena";

export const enterArena = createAsyncThunk(
  "get/enterArena",
  async (props: { type: PokemonType; address: string }) => {
    const body = JSON.stringify(props);

    const response: {
      success: boolean;
      data: { outcome: ArenaOutcome; serverAction: PokemonType };
      error?: any;
    } = await fetch(`${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/enter` || "", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    return { data: response.data };
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: { outcome: ArenaOutcome; serverAction: PokemonType } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const ArenaSlice = createSlice({
  name: "Arena",
  initialState,
  reducers: {
    clearArena: (state) => {
      state.error = null;
      state.loading = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    // Fetching Arena after Search
    builder.addCase(enterArena.pending, (state, action) => {
      // No need to set to null, since this will cause 'flashing' as transactions
      // state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(enterArena.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data || null;
    });
    builder.addCase(enterArena.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearArena } = ArenaSlice.actions;

export default ArenaSlice.reducer;
