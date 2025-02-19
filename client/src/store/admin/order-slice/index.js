import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

// function to fetch all the order List by admin
export const getAllOrdersByAmin = createAsyncThunk(
  "/orders/getAllOrdersByAmin",
  async (_, { rejectWithValue }) => {
      try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
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

// function to get the order details by admin
export const getOrderDetailsByAdmin = createAsyncThunk(
  "/order/getOrderDetailsByAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
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


// function to update order status by admin
export const updateOrderStatus = createAsyncThunk(
    "/order/updateOrderStatus",
    async ({id, orderStatus}, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,{orderStatus}
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
export const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetAminOrdeDetails : (state)=>{
        state.orderDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersByAmin.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getAllOrdersByAmin.fulfilled, (state, action) => {
        state.isloading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByAmin.rejected, (state) => {
        state.isloading = false;
      })
      .addCase(getOrderDetailsByAdmin.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getOrderDetailsByAdmin.fulfilled, (state, action) => {
        state.isloading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsByAdmin.rejected, (state) => {
        state.isloading = false;
      });
  },
});

export default adminOrderSlice.reducer;
export const {resetAminOrdeDetails} = adminOrderSlice.actions;