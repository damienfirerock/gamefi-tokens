import { configureStore } from "@reduxjs/toolkit";

import transactionReducer from "./features/TransactionSlice";
import accountReducer from "./features/AccountSlice";
import authReducer from "./features/AuthSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    account: accountReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
