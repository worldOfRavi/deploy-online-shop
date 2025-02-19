import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};


// function to add address to database
export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData, { rejectWithValue }) => {
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/address/add`,
        formData,
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

// function to fetch all address
export const fetchAllAddresses = createAsyncThunk(
    "/address/fetchAllAddresses",
    async (userId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/address/get/${userId}`,
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

//   function to updata address
  export const UpdateAddress = createAsyncThunk(
    "/address/UpdateAddress",
    async ({userId, addressId, formData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/user/address/update/${userId}/${addressId}`,
          formData,
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

  
// function to delete an address
  export const deleteAddress = createAsyncThunk(
    "address/deleteAddrss",
    async ({userId, addressId}, { rejectWithValue }) => {
        console.log(userId, addressId);
        
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/address/delete/${userId}/${addressId}`,
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
  

const AddressSlice = createSlice({
  name: "address-slice",
  initialState,
  reducers: {},
  extraReducers:(builder) =>{
    builder.addCase(addNewAddress.pending,(state)=>{
        state.isLoading = true;
    }).addCase(addNewAddress.fulfilled,(state)=>{
        state.isLoading = false;
    }).addCase(addNewAddress.rejected,(state)=>{
        state.isLoading = false
    }).addCase(fetchAllAddresses.pending,(state)=>{
        state.isLoading = true;
    }).addCase(fetchAllAddresses.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.addressList = action.payload.data;
    }).addCase(fetchAllAddresses.rejected,(state,action)=>{
        state.isLoading = false;
        state.addressList = [];
    }).addCase(UpdateAddress.pending,(state)=>{
        state.isLoading = true;
    }).addCase(UpdateAddress.fulfilled,(state)=>{
        state.isLoading = false
    }).addCase(UpdateAddress.rejected,(state)=>{
        state.isLoading = false
    }).addCase(deleteAddress.pending,(state)=>{
        state.isLoading = true;
    }).addCase(deleteAddress.fulfilled,(state)=>{
        state.isLoading = false
    }).addCase(deleteAddress.rejected,(state)=>{
        state.isLoading = false
    })
  }
});

export default AddressSlice.reducer;
