import { createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  cartId:null,
  cartItems: [],
};

export const addToCartItem = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/cart/add`,
        { userId, productId, quantity },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.log("Unexpected error ", error.message);
        throw new Error("An unexpected error occurred");
      }
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItem",
  async (userId, { rejectWithValue }) => {
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/cart/get/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        // console.log("Unexpected error ", error.message);
        // throw new Error("An unexpected error occurred");
      }
    }
  }
);

export const updateCartItems = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/cart/update-cart`,
        { userId, productId, quantity },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.log("Unexpected error ", error.message);
        throw new Error("An unexpected error occurred");
      }
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/cart/delete/${userId}/${productId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        return rejectWithValue(data);
      } else {
        console.log("Unexpected error ", error.message);
        throw new Error("An unexpected error occurred");
      }
    }
  }
);



const CartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCartItem.pending, (stata) => {
        stata.isLoading = true;
      })
      .addCase(addToCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })
      .addCase(addToCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = []
      }).addCase(fetchCartItems.pending, (stata) => {
        stata.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
        state.cartId = action.payload.data._id;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = []
      })
      .addCase(updateCartItems.pending, (stata) => {
        stata.isLoading = true;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })
      .addCase(updateCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = []
      }).addCase(deleteCartItem.pending, (stata) => {
        stata.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = []
      })
  },
});

export default CartSlice.reducer;

