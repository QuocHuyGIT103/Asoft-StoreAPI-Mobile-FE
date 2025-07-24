import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceService } from '../services';

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addInvoice = createAsyncThunk(
  'invoices/addInvoice',
  async (invoice, { rejectWithValue }) => {
    try {
      const response = await invoiceService.addInvoice(invoice);
      return invoice;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoice }, { rejectWithValue }) => {
    try {
      await invoiceService.updateInvoice(id, invoice);
      return invoice;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
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
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add invoice
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update invoice
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(i => i.invoiceID === action.payload.invoiceID);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i.invoiceID !== action.payload);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
