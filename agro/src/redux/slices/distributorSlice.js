import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { distributorService } from "../Services/distributorService";

export const fetchDistributors = createAsyncThunk(
  "distributor/fetchDistributors",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await distributorService.getDistributorList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDistributorsWOP = createAsyncThunk(
  "distributor/fetchDistributorsWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await distributorService.getDistributorWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDistributor = createAsyncThunk(
  "distributor/createDistributor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await distributorService.createDistributor(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDistributor = createAsyncThunk(
  "distributor/getDistributor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await distributorService.getDistributorById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDistributor = createAsyncThunk(
  "distributor/deleteDistributor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await distributorService.deleteDistributor(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeDistributorStatus = createAsyncThunk(
  "distributor/changeDistributorStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await distributorService.changeDistributorStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const distributorSlice = createSlice({
  name: "distributor",
  initialState: {
    distributors: [],
    distributorsWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearDistributorError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDistributors.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.distributors = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchDistributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDistributorsWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDistributorsWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.distributorsWOP = action.payload?.Data || [];
      })
      .addCase(fetchDistributorsWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDistributorError } = distributorSlice.actions;
export default distributorSlice.reducer;
