import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLaoding: false,
  productList: [],
};

// asyncthunk to add a new product
export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const resonse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
        formData,
        {
          withCredentials: true,
        }
      );
      return resonse?.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("An unexpected error occurred.");
      }
    }
  }
);

// async thunk to fetch all products

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products/get`,
        {
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("An unexpected error occurred.");
      }
    }
  }
);

// asyncthunk to update a product

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({id, formData}, thunkAPI) => {

    // in createAsyncThunk the second parameter is thunkAPI, so close all the other parameter into an object and make the thunkAPI as the second parameter
    const { rejectWithValue } = thunkAPI
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`, formData,
        {
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
        if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("An unexpected error occurred.");
      }
    }
  }
);


// asyncthunk to delete a product

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
        if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("An unexpected error occurred.");
      }
    }
  }
);
const AdminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLaoding = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        
        state.isLaoding = false;
        state.productList = action.payload.data
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLaoding = false;
        state.productList = []
      });
  },
});

export const {} = AdminProductSlice.actions;

export default AdminProductSlice.reducer;
