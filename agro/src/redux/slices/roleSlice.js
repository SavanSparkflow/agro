import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roleService } from "../Services/roleService";

export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRolesWOP = createAsyncThunk(
  "role/fetchRolesWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getRole = createAsyncThunk(
  "role/getRole",
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleService.deleteRole(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeRoleStatus = createAsyncThunk(
  "role/changeRoleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await roleService.changeRoleStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roles: [],
    rolesWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.roles = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRolesWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRolesWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.rolesWOP = action.payload?.Data || [];
      })
      .addCase(fetchRolesWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;
