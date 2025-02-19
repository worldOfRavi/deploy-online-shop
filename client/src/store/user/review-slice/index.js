import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviewList: [],
};

// function to add product review
export const addProductReview = createAsyncThunk(
  "/user/addProductReview",
  async (formData, { rejectWithValue }) => {
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/review/add`, formData,
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


// function to fetch product review
export const fetchProductReview = createAsyncThunk(
  "/user/fetchProductReview",
  async (productId, { rejectWithValue }) => {
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/review/get/${productId}`,
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


const UserProductReviewSlice = createSlice({
  name: "UserProductReviewSlice",
  initialState,
  reducers: { 
    setOpenProductDetails :(state)=>{
      state.productDetails = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductReview.pending, (state)=>{
        state.isLoading = true
    }).addCase(fetchProductReview.fulfilled, (state,action)=>{
        state.isLoading  = false;
        state.reviewList = action.payload.data;
    }).addCase(fetchProductReview.rejected, (state)=>{
        state.isLoading = false;
    })
  }
});


export default UserProductReviewSlice.reducer;


