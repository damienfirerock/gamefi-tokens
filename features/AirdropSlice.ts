import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type SliceState = {
  hasClaimed: boolean;
  error?: null | string;
  loading: boolean;
  data: { outcome: boolean } | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  hasClaimed: false,
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
    setHasClaimed: (state, action) => {
      state.hasClaimed = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { clearError, setHasClaimed } = AirdropSlice.actions;

export default AirdropSlice.reducer;
