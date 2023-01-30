import { configureStore } from "@reduxjs/toolkit";

import transactionsReducer from "./features/TransactionsSlice";
import multiSigReducer from "./features/MultiSigSlice";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    multiSig: multiSigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
