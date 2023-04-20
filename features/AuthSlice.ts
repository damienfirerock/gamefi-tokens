import { createSlice } from "@reduxjs/toolkit";
import { Session } from "next-auth/core/types";

type SliceState = {
  dialogOpen: boolean;
  loading: boolean;
  session: Session | null;
};

const initialState: SliceState = {
  dialogOpen: false,
  loading: true,
  session: null,
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
    setDialogOpen: (state) => {
      state.dialogOpen = true;
    },
    setDialogClosed: (state) => {
      state.dialogOpen = false;
    },
  },
});

export const { setSession, setLoading, setDialogOpen, setDialogClosed } =
  authSlice.actions;
export default authSlice.reducer;
