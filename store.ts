import { configureStore } from "@reduxjs/toolkit";

import transactionReducer from "./features/TransactionSlice";
import multiSigReducer from "./features/MultiSigSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    multiSig: multiSigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
