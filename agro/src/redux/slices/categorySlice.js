import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../Services/categoryService";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoriesWOP = createAsyncThunk(
  "category/fetchCategoriesWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteCategory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeCategoryStatus = createAsyncThunk(
  "category/changeCategoryStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.changeCategoryStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    categoriesWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.categories = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoriesWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesWOP = action.payload?.Data || [];
      })
      .addCase(fetchCategoriesWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
