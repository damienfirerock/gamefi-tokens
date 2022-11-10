import { configureStore } from "@reduxjs/toolkit";

import depositsReducer from "./features/DepositsSlice";
import productsReducer from "./features/ProductsSlice";
import transactionsReducer from "./features/TransactionsSlice";
import luckyDrawEntrantsReducer from "./features/LuckyDrawEntrantsSlice";
import listingsReducer from "./features/ListingsSlice";
import marketPlaceProductsReducer from "./features/MarketPlaceProductsSlice";
import arenaReducer from "./features/ArenaSlice";

const store = configureStore({
  reducer: {
    deposits: depositsReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    luckyDrawEntrants: luckyDrawEntrantsReducer,
    listings: listingsReducer,
    marketPlaceProducts: marketPlaceProductsReducer,
    arena: arenaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
