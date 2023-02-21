import { configureStore } from "@reduxjs/toolkit";

import transactionReducer from "./features/TransactionSlice";
import airdropReducer from "./features/AirdropSlice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    airdrop: airdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
