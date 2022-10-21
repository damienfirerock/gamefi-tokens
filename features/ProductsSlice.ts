import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IProduct } from "../interfaces/IProduct";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;
const ENDPOINT = "/api/v1/products";

interface IProductFilter {
  owner?: string;
}

const sortProductsByDescription = (array: IProduct[]) => {
  const nextArray = array.sort(
    (a, b) => parseInt(a.description) - parseInt(b.description)
  );

  return nextArray;
};

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

export const fetchProducts = createAsyncThunk(
  "post/fetchProducts",
  async (payload?: IProductFilter) => {
    abortController.abort(); // cancel previous request
    abortController = abortControllerObj && new abortControllerObj();

    const body = JSON.stringify(payload);

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        signal: abortControllerObj && abortController.signal,
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

export const updateDBAfterTokenSalePurchase = createAsyncThunk(
  "get/updateDBAfterTokenSalePurchase",
  async (props: {
    tokenId: number;
    txDetails: { transactionHash: string; from: string; to: string };
  }) => {
    const { tokenId, txDetails } = props;
    const body = JSON.stringify({ tokenId, txDetails });

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/update-owner` || "",
      {
        method: "PATCH",
        headers: new Headers({ "content-type": "application/json" }),
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    const nextResponse: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        signal: abortControllerObj && abortController.signal,
      }
    ).then((res) => res.json());
    if (nextResponse.error) return Promise.reject(nextResponse.error);

    if (nextResponse.data?.length) {
      return sortProductsByDescription(nextResponse.data);
    }

    return nextResponse.data;
  }
);

export const updateDBAfterPokemonCenterTransaction = createAsyncThunk(
  "get/updateDBAfterPokemonCenterTransaction",
  async (props: {
    tokenId: number;
    txDetails: { transactionHash: string; from: string; to: string };
  }) => {
    const { tokenId, txDetails } = props;
    const body = JSON.stringify({ tokenId, txDetails });

    const response: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}/update-owner` || "",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body,
      }
    ).then((res) => res.json());

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //The fetch() method returns a Promise that resolves regardless of whether the request is successful,
    // unless there's a network error.
    // In other words, the Promise isn't rejected even when the response has an HTTP 400 or 500 status code.
    if (response.error) return Promise.reject(response.error);

    const nextBody = JSON.stringify({ owner: txDetails.from });

    const nextResponse: any = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}${ENDPOINT}` || "",
      {
        method: "POST",
        signal: abortControllerObj && abortController.signal,
        headers: { "content-type": "application/json" },
        body: nextBody,
      }
    ).then((res) => res.json());
    if (nextResponse.error) return Promise.reject(nextResponse.error);

    if (nextResponse.data?.length) {
      return sortProductsByDescription(nextResponse.data);
    }

    return nextResponse.data;
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
    builder.addCase(updateDBAfterTokenSalePurchase.pending, (state) => {
      // Runs 'silently'
    });
    builder.addCase(
      updateDBAfterTokenSalePurchase.fulfilled,
      (state, action: { payload: IProduct[] }) => {
        // Bug: state.data[index] = action.payload; does not update the main
        // const { data } = state;
        // if (!data) return;
        // const index = data.findIndex(
        //   (element) => action.payload.tokenId === element.tokenId
        // );
        // if (!state?.data?.[index]) return;
        // state.data[index] = action.payload;
        state.data = action.payload;
      }
    );
    builder.addCase(
      updateDBAfterTokenSalePurchase.rejected,
      (state, action) => {
        state.error = action.error.message;
      }
    );
    builder.addCase(updateDBAfterPokemonCenterTransaction.pending, (state) => {
      // Runs 'silently'
    });
    builder.addCase(
      updateDBAfterPokemonCenterTransaction.fulfilled,
      (state, action: { payload: IProduct[] }) => {
        state.data = action.payload;
      }
    );
    builder.addCase(
      updateDBAfterPokemonCenterTransaction.rejected,
      (state, action) => {
        state.error = action.error.message;
      }
    );
  },
});

export const { clearProducts } = ProductsSlice.actions;

export default ProductsSlice.reducer;
