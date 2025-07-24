import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';
import productReducer from './productSlice';
import invoiceReducer from './invoiceSlice';

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    products: productReducer,
    invoices: invoiceReducer,
  },
});

export default store;
