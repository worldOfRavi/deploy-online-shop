import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import adminProductReducer from "./admin/product-slice";
import adminOrderReducer from "./admin/order-slice";
import userProductReducer from "./user/product-slice"
import cartSliceReducer from "./user/cart-slice";
import addressSliceReducer from "./user/address-slice/index";
import orderSliceReducer from "./user/order-slice/index";
import productSearchSlice from "./user/search-slice";
import UserProductReviewSlice from "./user/review-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
    reducer:{
        // auth slice
        authReducer,

        // admin slice
        adminProductReducer,
        adminOrder : adminOrderReducer,

        // user slice
        userProductReducer,
        cartSlice:cartSliceReducer,
        addressSlice:addressSliceReducer,
        orderSlice: orderSliceReducer,
        searchSlice : productSearchSlice,
        reviewSlice : UserProductReviewSlice,
        // common feature slice
        commonFeature : commonFeatureSlice
    }
})

export default store;
