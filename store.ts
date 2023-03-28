import { configureStore } from "@reduxjs/toolkit";

import transactionReducer from "./features/TransactionSlice";
import swapReducer from "./features/SwapSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    swap: swapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
