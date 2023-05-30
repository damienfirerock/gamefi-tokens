import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Session } from "next-auth/core/types";

// Also serves as a way to check against references for translation in localisation folder
export enum AuthSuccessMessage {
  RequestedVerifyCode = "RequestedVerifyCode",
  RegisteredWithEmail = "RegisteredWithEmail",
  PasswordChanged = "PasswordChanged",
  EmailLoginSuccess = "EmailLoginSuccess",
  SocialLoginSuccess = "SocialLoginSuccess",
}

export enum AuthFailureMessage {
  SendVerifyCodeFailed = "SendVerifyCodeFailed",
  BeyondVerifyCodeMaxSendCount = "BeyondVerifyCodeMaxSendCount",
}

// Hides http endpoint as proxy
// Site is loaded over https and won't allow mixed loading
export const PROXY_AUTH_ENDPOINT = "api/proxy-backend";
const REQUEST_VERIFY_TOKEN_PATH = "/request-verification-code";
const REGISTER_EMAIL_PATH = "/email-register";
const CHANGE_PASSWORD_PATH = "/change-password";
export const EMAIL_LOGIN_PATH = "/email-login";
const SOCIAL_LOGIN_PATH = "/social-login";
const GET_ACCOUNT_PATH = "/get-union-account";

// Endpoint is the same regardless of whether verification code is requested for registration or password change
export const requestVerificationCode = createAsyncThunk(
  "get/requestVerificationCode",
  async (props: { context: string }) => {
    const body = JSON.stringify({ ...props, verifycodetype: "VCT_Email" });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${REQUEST_VERIFY_TOKEN_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

export const registerViaEmail = createAsyncThunk(
  "get/registerViaEmail",
  async (props: { email: string; password: string; verifyCode: string }) => {
    const body = JSON.stringify({ ...props });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${REGISTER_EMAIL_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

export const changePassword = createAsyncThunk(
  "get/changePassword",
  async (props: { email: string; password: string; verifyCode: string }) => {
    const body = JSON.stringify({ ...props });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${CHANGE_PASSWORD_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

// The following has been integrated into next-auth signin,
// And can be removed in the future
export const loginViaEmail = createAsyncThunk(
  "get/loginViaEmail",
  async (props: { email: string; password: string }) => {
    const body = JSON.stringify({ ...props });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${EMAIL_LOGIN_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

export const loginViaSocial = createAsyncThunk(
  "get/loginViaSocial",
  async (props: { thirdToken: string; loginType: string }) => {
    const body = JSON.stringify({ ...props });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${SOCIAL_LOGIN_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

export const getUnionAccount = createAsyncThunk(
  "get/loginViaSocial",
  async (props: { accessToken: string }) => {
    const body = JSON.stringify({ ...props });

    const response: {
      success: boolean;
      error?: any;
    } = await fetch(`${PROXY_AUTH_ENDPOINT}${GET_ACCOUNT_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    if (response.error) return Promise.reject(response.error);

    return response || null;
  }
);

type SliceState = {
  dialogOpen: boolean;
  accountDetailsOpen: HTMLButtonElement | null;
  accountDetailsButtonRef: HTMLButtonElement | null;
  loading: boolean;
  session: Session | null;
  error?: null | string;
  success?: null | string;
};

const initialState: SliceState = {
  dialogOpen: false,
  accountDetailsOpen: null,
  accountDetailsButtonRef: null,
  loading: true,
  session: null,
  error: null,
  success: null,
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
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = null;
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
    // Get Verification Code
    builder.addCase(requestVerificationCode.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestVerificationCode.fulfilled, (state, action) => {
      state.loading = false;
      state.success = AuthSuccessMessage.RequestedVerifyCode;
    });
    builder.addCase(requestVerificationCode.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
    //Register via Email
    builder.addCase(registerViaEmail.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerViaEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.success = AuthSuccessMessage.RegisteredWithEmail;
    });
    builder.addCase(registerViaEmail.rejected, (state, action) => {
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
    //Change Password
    builder.addCase(changePassword.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = AuthSuccessMessage.PasswordChanged;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
    //Login via Email
    builder.addCase(loginViaEmail.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginViaEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.success = AuthSuccessMessage.EmailLoginSuccess;
    });
    builder.addCase(loginViaEmail.rejected, (state, action) => {
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
    //Login via Social
    builder.addCase(loginViaSocial.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginViaSocial.fulfilled, (state, action) => {
      state.loading = false;
      state.success = AuthSuccessMessage.SocialLoginSuccess;
    });
    builder.addCase(loginViaSocial.rejected, (state, action) => {
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const {
  clearError,
  setSuccess,
  clearSuccess,
  setSession,
  setLoading,
  setDialogOpen,
  setDialogClosed,
  setAccountDetailsOpen,
  setAccountDetailsButtonRef,
} = authSlice.actions;
export default authSlice.reducer;
