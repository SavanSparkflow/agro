import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { roleApi } from './api/roleApi';
import { permissionApi } from './api/permissionApi';
import { departmentApi } from './api/departmentApi';
import { productApi } from './api/productApi';
import { categoryApi } from './api/categoryApi';
import { unitApi } from './api/unitApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      roleApi.middleware, 
      permissionApi.middleware,
      departmentApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      unitApi.middleware
    ),
});
