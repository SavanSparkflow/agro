import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roleReducer from './slices/roleSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import unitReducer from './slices/unitSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import customerReducer from './slices/customerSlice';
import distributorReducer from './slices/distributorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    product: productReducer,
    category: categoryReducer,
    unit: unitReducer,
    user: userReducer,
    order: orderReducer,
    customer: customerReducer,
    distributor: distributorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
