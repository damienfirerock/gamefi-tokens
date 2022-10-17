import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IProduct } from "../interfaces/IProduct";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/products";

// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
let abortController: any;
let abortControllerObj: any;
// Check for process.browser to prevent window error
// https://stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
// Also check if AbortController is present in client browser
if (process.browser && AbortController) {
  abortControllerObj = AbortController;
  abortController = new AbortController();
}

export const abortFetchProducts = () => {
  abortController.abort(); // cancel previous request
  abortController = new abortControllerObj();
};

export const fetchProducts = createAsyncThunk("get/fetchProducts", async () => {
  abortController.abort(); // cancel previous request
  abortController = abortControllerObj && new abortControllerObj();

  const response: any = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
    {
      signal: abortControllerObj && abortController.signal,
    }
  ).then((res) => res.json());

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
  // unless there's a network error.
  // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
  if (response.error) return Promise.reject(response.error);

  return response.data;
});

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

export const ProductsSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetching Products after Search
    builder.addCase(fetchProducts.pending, (state) => {
      state.data = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      // If abortController.abort(), error name will be 'AbortError'
      if (action.error.name !== "AbortError") {
        state.loading = false;
        state.error = action.error.message;
      }
    });
  },
});

export const { clearProducts } = ProductsSlice.actions;

export default ProductsSlice.reducer;
