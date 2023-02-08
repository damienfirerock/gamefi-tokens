import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  DecodedData,
  handleDecodeCalldataWith4Bytes,
} from "../utils/callDataDecoder";

import { EMPTY_CALLDATA } from "../constants";

export const decodeData = createAsyncThunk(
  "get/decodeData",
  async (data: string) => {
    if (data === EMPTY_CALLDATA) return null;

    const response = await handleDecodeCalldataWith4Bytes(data);
    return response?.[0] || null;
  }
);

type SliceState = {
  data: DecodedData | null;
  decimals: number | null;
  error?: null | string;
  loading: boolean;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  data: null,
  decimals: null,
  error: null,
  loading: false,
};

export const DecodedDataSlice = createSlice({
  name: "DecodedDatas",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDecimals: (state, action) => {
      state.decimals = action.payload;
    },
    clearDecimals: (state) => {
      state.decimals = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(decodeData.pending, (state, action) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(decodeData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(decodeData.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearError, setDecimals, clearDecimals } =
  DecodedDataSlice.actions;

export default DecodedDataSlice.reducer;
