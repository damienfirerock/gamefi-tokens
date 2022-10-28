import { configureStore } from "@reduxjs/toolkit";

import depositsReducer from "./features/DepositsSlice";
import productsReducer from "./features/ProductsSlice";
import transactionsReducer from "./features/TransactionsSlice";
import luckyDrawEntrantsReducer from "./features/LuckyDrawEntrantsSlice";

const store = configureStore({
  reducer: {
    deposits: depositsReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    luckyDrawEntrants: luckyDrawEntrantsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
