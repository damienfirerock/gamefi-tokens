import { createSlice } from "@reduxjs/toolkit";
import { Session } from "next-auth/core/types";

type SliceState = {
  dialogOpen: boolean;
  accountDetailsOpen: HTMLButtonElement | null;
  accountDetailsButtonRef: HTMLButtonElement | null;
  loading: boolean;
  session: Session | null;
};

const initialState: SliceState = {
  dialogOpen: false,
  accountDetailsOpen: null,
  accountDetailsButtonRef: null,
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
    setAccountDetailsOpen: (state, action) => {
      state.accountDetailsOpen = action.payload;
    },
    setAccountDetailsButtonRef: (state, action) => {
      state.accountDetailsButtonRef = action.payload;
    },
  },
});

export const {
  setSession,
  setLoading,
  setDialogOpen,
  setDialogClosed,
  setAccountDetailsOpen,
  setAccountDetailsButtonRef,
} = authSlice.actions;
export default authSlice.reducer;
