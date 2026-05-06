import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../Services/orderService";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.deleteOrder(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  "order/changeOrderStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.changeOrderStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.orders = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
