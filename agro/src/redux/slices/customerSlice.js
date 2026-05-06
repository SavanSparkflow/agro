import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../Services/customerService";

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCustomersWOP = createAsyncThunk(
  "customer/fetchCustomersWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCustomer = createAsyncThunk(
  "customer/getCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.deleteCustomer(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitCustomerFeedback = createAsyncThunk(
  "customer/submitFeedback",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customerService.submitFeedback(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeCustomerStatus = createAsyncThunk(
  "customer/changeCustomerStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.changeCustomerStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    customersWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.customers = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomersWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomersWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.customersWOP = action.payload?.Data || [];
      })
      .addCase(fetchCustomersWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
