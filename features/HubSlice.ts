import { createSlice } from "@reduxjs/toolkit";

// TODO: Pending confirmation
type SliceState = {
  error?: null | string;
  loading: boolean;
  data: {
    rate: number;
    tax: number;
    withdrawalPeriod: number; //seconds
    minimum: number;
  } | null;
};

const initialState: SliceState = {
  error: null,
  loading: false,
  data: { rate: 10, tax: 3, withdrawalPeriod: 86400, minimum: 1000 },
};

export const HubSlice = createSlice({
  name: "Hub",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {},
});

export const { clearError } = HubSlice.actions;

export default HubSlice.reducer;
