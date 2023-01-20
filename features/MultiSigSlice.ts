import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;

const ENDPOINT = "/api/v1/multisig";

export const submitSignature = createAsyncThunk(
  "get/submitSignature",
  async (props: { signature: string }) => {
    const body = JSON.stringify(props);

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/sign` || "", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    return { success: response.success };
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const MultiSigSlice = createSlice({
  name: "MultiSig",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Claim Experience Points
    builder.addCase(submitSignature.pending, (state, action) => {
      // No need to set to null, since this will cause 'flashing' as transactions
      // state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitSignature.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(submitSignature.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearError } = MultiSigSlice.actions;

export default MultiSigSlice.reducer;
