import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../services";

// Async thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customer, { rejectWithValue }) => {
    try {
      const response = await customerService.addCustomer(customer);
      return customer;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, customer }, { rejectWithValue }) => {
    try {
      await customerService.updateCustomer(id, customer);
      return customer;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add customer
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c.customerID === action.payload.customerID
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => c.customerID !== action.payload
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;
