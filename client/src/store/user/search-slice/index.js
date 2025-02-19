import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading : false,
    searchResult : []
}

export const searchProduct = createAsyncThunk("/user/searchProduct",
    async(keyword, {rejectWithValue})=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/search/${keyword}`);
            return response.data
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
)

const productSearchSlice = createSlice({
    name:"productSearchSlice",
    initialState,
    reducers:{
        resetSearchResult : (state)=>{
            state.searchResult = []
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(searchProduct.pending, (state)=>{
            state.isLoading = true
        }).addCase(searchProduct.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.searchResult = action.payload.data;
        }).addCase(searchProduct.rejected,(state)=>{
            state.isLoading = false;
            state.searchResult = []
        })
    }
})
export const {resetSearchResult} = productSearchSlice.actions;
export default productSearchSlice.reducer;