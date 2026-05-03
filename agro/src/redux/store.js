import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { roleApi } from './api/roleApi';
import { productApi } from './api/productApi';
import { categoryApi } from './api/categoryApi';
import { unitApi } from './api/unitApi';
import { userApi } from './api/userApi';
import { orderApi } from './api/orderApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      roleApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      unitApi.middleware,
      userApi.middleware,
      orderApi.middleware
    ),
});
