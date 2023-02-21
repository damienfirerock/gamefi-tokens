import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { AirdropTxnType } from "../pages/api/airdrop";

const ENDPOINT = "/api/airdrop";

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const submitSignature = createAsyncThunk(
  "get/submitSignature",
  async (props: {
    txIndex: number;
    address: string;
    nonce: number;
    signature: string;
    // type: AirdropTxnType;
  }) => {
    const body = JSON.stringify(props);

    const response: {
      success: boolean;
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

    // Wait 15 seconds for the changes to be reflected in the network
    // See hotfix mentioned in api/airdrop
    console.log("waiting");
    await timeout(15000);

    return { success: response.success };
  }
);

type SliceState = {
  isOwner: boolean;
  owners: string[] | null;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  owners: null,
  isOwner: false,
  error: null,
  loading: false,
  data: null,
};

export const AirdropSlice = createSlice({
  name: "Airdrop",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    setOwners: (state, action) => {
      state.owners = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitSignature.pending, (state, action) => {
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

export const { clearError, setIsOwner, setOwners } = AirdropSlice.actions;

export default AirdropSlice.reducer;
