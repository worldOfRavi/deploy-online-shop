import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isloading : false,
    approvedURL : null,
    orderId : null,
    orderList : [],
    orderDetails : null

}

// function to create a order and initiate a payment
export const createOrderPayment  = createAsyncThunk("/order/createPayment",
    async(orderData, {rejectWithValue}) =>{
        try {
            const response  = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/order/create`, orderData);
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

// function to make the order confirm after the payment
export const captureOrderPayment  = createAsyncThunk("/order/captureOrderPayment",
    async({paymentId, payerId, orderId}, {rejectWithValue}) =>{
        try {
            const response  = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/order/capture`, {paymentId, payerId, orderId});
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

// function to fetch all the order List
export const getAllOrdersByUser  = createAsyncThunk("/getAllOrderByUser/getAllOrdersByUser",
    async(userId, {rejectWithValue}) =>{
        try {
            const response  = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/order/fetch/${userId}`);
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


// function to make the order confirm after the payment
export const getOrderDetails  = createAsyncThunk("/order/getOrderDetails",
    async(id, {rejectWithValue}) =>{
        try {
            const response  = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/order/get/${id}`);
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
const orderSlice = createSlice({
    name:"orderSlice",
    initialState,
    reducers : {
        resetOrderDetails : (state) =>{
            state.orderDetails = null
        }
    },
    extraReducers :(builder) =>{
        builder.addCase(createOrderPayment.pending , (state)=>{
            state.isloading = true
        }).addCase(createOrderPayment.fulfilled, (state, action)=>{
            state.isloading = false;
            state.approvedURL = action.payload.approvedURL,
            state.orderId = action.payload.orderId;
            // as we come back from the paypal site, this orderId would be unavailable, so that we can store it in the sessionStorage so that we can get it back when we actually need it
            sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
        }).addCase(createOrderPayment.rejected, (state)=>{
            state.isloading = false
        }).addCase(getAllOrdersByUser.pending , (state)=>{
            state.isloading = true
        }).addCase(getAllOrdersByUser.fulfilled , (state,action)=>{
            state.isloading = false;
            state.orderList = action.payload.data
        }).addCase(getAllOrdersByUser.rejected , (state)=>{
            state.isloading = false
        }).addCase(getOrderDetails.pending , (state)=>{
            state.isloading = true
        }).addCase(getOrderDetails.fulfilled , (state,action)=>{
            state.isloading = false;
            state.orderDetails = action.payload.data
        }).addCase(getOrderDetails.rejected , (state)=>{
            state.isloading = false
        })
    }
})

export default orderSlice.reducer;
export const {resetOrderDetails} = orderSlice.actions;