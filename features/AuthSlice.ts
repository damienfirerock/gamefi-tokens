import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Session } from "next-auth/core/types";

// Hides http endpoint as proxy
// Site is loaded over https and won't allow mixed loading
const URL_ENDPOINT = "api/proxy-backend";
const REQUEST_VERIFY_TOKEN_PATH = "/request-verification-code";

// Endpoint is the same regardless of whether verification code is requested for registration or password change
export const requestVerificationCode = createAsyncThunk(
  "get/requestVerificationCode",
  async (props: { context: string }) => {
    const body = JSON.stringify({ ...props, verifycodetype: "VCT_Email" });

    const response: {
      success: boolean;
      txnHash?: string;
      error?: any;
    } = await fetch(`${URL_ENDPOINT}${REQUEST_VERIFY_TOKEN_PATH}`, {
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

type SliceState = {
  dialogOpen: boolean;
  accountDetailsOpen: HTMLButtonElement | null;
  accountDetailsButtonRef: HTMLButtonElement | null;
  loading: boolean;
  session: Session | null;
  error?: null | string;
};

const initialState: SliceState = {
  dialogOpen: false,
  accountDetailsOpen: null,
  accountDetailsButtonRef: null,
  loading: true,
  session: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setDialogOpen: (state) => {
      state.dialogOpen = true;
    },
    setDialogClosed: (state) => {
      state.dialogOpen = false;
    },
    setAccountDetailsOpen: (state, action) => {
      state.accountDetailsOpen = action.payload;
    },
    setAccountDetailsButtonRef: (state, action) => {
      state.accountDetailsButtonRef = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestVerificationCode.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestVerificationCode.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(requestVerificationCode.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const {
  clearError,
  setSession,
  setLoading,
  setDialogOpen,
  setDialogClosed,
  setAccountDetailsOpen,
  setAccountDetailsButtonRef,
} = authSlice.actions;
export default authSlice.reducer;
