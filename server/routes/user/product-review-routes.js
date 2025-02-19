import express from 'express';
import ProductReviewController from '../../controllers/user/product-review-controller.js';

const router = express.Router();

router.route("/add").post(ProductReviewController.addProductReview);
router.route("/get/:productId").get(ProductReviewController.getProductReviews);


export default router;