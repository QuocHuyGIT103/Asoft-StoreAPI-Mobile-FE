import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await productService.addProduct(product);
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, product }, { rejectWithValue }) => {
    try {
      await productService.updateProduct(id, product);
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
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
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.productID === action.payload.productID);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.productID !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
