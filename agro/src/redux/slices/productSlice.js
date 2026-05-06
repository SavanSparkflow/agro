import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../Services/productService";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productService.getProductList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductsWOP = createAsyncThunk(
  "product/fetchProductsWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await productService.getProductWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeProductStatus = createAsyncThunk(
  "product/changeProductStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.changeProductStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  "product/uploadProductImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await productService.uploadProductImage(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productsWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
    uploading: false,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.products = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.productsWOP = action.payload?.Data || [];
      })
      .addCase(fetchProductsWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProductImage.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadProductImage.rejected, (state) => {
        state.uploading = false;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
