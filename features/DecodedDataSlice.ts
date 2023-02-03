import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  DecodedData,
  handleDecodeCalldataWith4Bytes,
} from "../utils/callDataDecoder";

export const decodeData = createAsyncThunk(
  "get/decodeData",
  async (data: string) => {
    return await handleDecodeCalldataWith4Bytes(data);
  }
);

type SliceState = {
  data?: DecodedData[] | null;
  error?: null | string;
  loading: boolean;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  data: null,
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
  },
  extraReducers: (builder) => {
    builder.addCase(decodeData.pending, (state, action) => {
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

export const { clearError } = DecodedDataSlice.actions;

export default DecodedDataSlice.reducer;
