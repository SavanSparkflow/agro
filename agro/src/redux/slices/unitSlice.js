import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unitService } from "../Services/unitService";

export const fetchUnits = createAsyncThunk(
  "unit/fetchUnits",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await unitService.getUnitList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnitsWOP = createAsyncThunk(
  "unit/fetchUnitsWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await unitService.getUnitWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUnit = createAsyncThunk(
  "unit/createUnit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await unitService.createUnit(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUnit = createAsyncThunk(
  "unit/getUnit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await unitService.getUnitById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "unit/deleteUnit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await unitService.deleteUnit(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeUnitStatus = createAsyncThunk(
  "unit/changeUnitStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await unitService.changeUnitStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    units: [],
    unitsWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearUnitError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.units = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnitsWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnitsWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.unitsWOP = action.payload?.Data || [];
      })
      .addCase(fetchUnitsWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUnitError } = unitSlice.actions;
export default unitSlice.reducer;
