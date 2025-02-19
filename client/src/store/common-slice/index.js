import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// function to add product review
export const addFeatureImage = createAsyncThunk(
  "/user/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/common/feature/add`,{image} // here image is single item so we need to wrap it in an object
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


// function to delete feature image
export const deleteFeatureImage = createAsyncThunk(
  "/user/deleteFeatureImage",
  async (imageId, { rejectWithValue }) => {
    console.log(imageId);
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/common/feature/delete/${imageId}` // here image is single item so we need to wrap it in an object
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
export const getFeatureImages = createAsyncThunk(
  "/user/getFeatureImages",
  async (_, { rejectWithValue }) => {
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/common/feature/get`,
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


const featureIamgeSlice = createSlice({
  name: "featureIamgeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeatureImages.pending, (state)=>{
        state.isLoading = true
    }).addCase(getFeatureImages.fulfilled, (state,action)=>{
        state.isLoading  = false;
        state.featureImageList = action.payload.data;
    }).addCase(getFeatureImages.rejected, (state)=>{
        state.isLoading = false;
        state.featureImageList = []
    })
  }
});


export default featureIamgeSlice.reducer;


