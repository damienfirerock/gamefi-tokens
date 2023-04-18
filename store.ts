import { configureStore } from "@reduxjs/toolkit";

import transactionReducer from "./features/TransactionSlice";
import swapReducer from "./features/SwapSlice";
import authReducer from "./features/AuthSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    swap: swapReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
