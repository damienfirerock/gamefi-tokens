import { configureStore } from "@reduxjs/toolkit";

import depositsReducer from "./features/DepositsSlice";
import productsReducer from "./features/ProductsSlice";
import transactionsReducer from "./features/TransactionsSlice";
import luckyDrawEntrantsReducer from "./features/LuckyDrawEntrantsSlice";
import marketPlaceReducer from "./features/MarketPlaceSlice";

const store = configureStore({
  reducer: {
    deposits: depositsReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    luckyDrawEntrants: luckyDrawEntrantsReducer,
    marketPlace: marketPlaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
