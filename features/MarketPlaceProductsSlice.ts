import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IProduct } from "../interfaces/IProduct";
import { sortProductsByDescription } from "../utils/common";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/products";

interface IProductFilter {
  owner?: string;
  tokenId?: string;
}

// Essentially the same as fetchProducts in productsSlice
// But it is probably better to separate the two slices instead of getting all the data
// And filtering on the browser
export const fetchMarketPlaceProducts = createAsyncThunk(
  "post/fetchMarketPlaceProducts",
  async (payload?: IProductFilter) => {
    const body = JSON.stringify(payload);

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    if (response.data?.length) {
      return sortProductsByDescription(response.data);
    }

    return response.data;
  }
);

type SliceState = {
  error?: null | string;
  loading: boolean;
  data: IProduct[] | null;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  error: null,
  loading: false,
  data: null,
};

export const MarketPlaceProductsSlice = createSlice({
  name: "MarketPlace",
  initialState,
  reducers: {
    clearMarketPlaceProducts: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetching MarketPlace after Search
    builder.addCase(fetchMarketPlaceProducts.pending, (state) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMarketPlaceProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchMarketPlaceProducts.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearMarketPlaceProducts } = MarketPlaceProductsSlice.actions;

export default MarketPlaceProductsSlice.reducer;
