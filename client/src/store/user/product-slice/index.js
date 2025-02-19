import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// function to fetch the filterproducts from the user view
export const fetchFilteredProducts = createAsyncThunk(
  "user/product",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      // if it optional that we can pass the filter and sort in as query including it in the URL
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/products/get?${query}`,
        {
          withCredentials: true,
        }
      );
      // else we can pass the filters and the sort as params separate from the URL as the additional data
      // const response  = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/products/get`,{params:{...filterParams, sort:sortParams}},{
      //     withCredentials:true
      // });
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

// function to get the product detail
export const fetchProductDetail = createAsyncThunk(
  "/user/productDetails",
  async (id, { rejectWithValue }) => {
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/products/get/${id}`,
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

const UserProductSlice = createSlice({
  name: "userProductSlice",
  initialState,
  reducers: { 
    setOpenProductDetails :(state)=>{
      state.productDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchFilteredProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const {setOpenProductDetails} = UserProductSlice.actions;
export default UserProductSlice.reducer;
