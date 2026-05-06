import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../Services/userService";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.getUserList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUsersWOP = createAsyncThunk(
  "user/fetchUsersWOP",
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await userService.getUserWOP(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  "user/changeUserStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.changeUserStatus(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    usersWOP: [],
    loading: false,
    error: null,
    totalRecords: 0,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const dataWrapper = action.payload?.Data || {};
        state.users = dataWrapper.docs || [];
        state.totalRecords = dataWrapper.totalDocs || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsersWOP.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersWOP.fulfilled, (state, action) => {
        state.loading = false;
        state.usersWOP = action.payload?.Data || [];
      })
      .addCase(fetchUsersWOP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
