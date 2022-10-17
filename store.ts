import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./features/ProductsSlice";
import transactionsReducer from "./features/TransactionsSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
