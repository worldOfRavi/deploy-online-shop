import express from 'express';
import authRouter from "./auth-route/auth-route.js";
import adminProductRouter from "./admin/products-routes.js";
import adminOrderRouter from "./admin/order-routes.js";
import userProductRouter from "./user/products-route.js"
import cartRouter from "./user/cart-routes.js"
import addressRouter from "./user/address-routes.js"
import orderRouter from "./user/order-routes.js"
import searchRouter from "./user/search-routes.js"
import reviewRouter from "./user/product-review-routes.js"
import commonFeatureImageRouter from "./common/feature-image-router.js"
const router  = express.Router();

// auht route
router.use("/api/auth",authRouter);
// admin route
router.use("/api/admin/products",adminProductRouter);

// admin order routes
router.use("/api/admin/orders",adminOrderRouter);
// user route
router.use("/api/user/products",userProductRouter);
// cart route
router.use("/api/user/cart", cartRouter);

// user address route
router.use("/api/user/address", addressRouter);

// user order route
router.use("/api/user/order", orderRouter);

// product search route
router.use("/api/user/search", searchRouter);

// product review route
router.use("/api/user/review", reviewRouter);


// common feature imges route
router.use("/api/common/feature", commonFeatureImageRouter);

export default router;