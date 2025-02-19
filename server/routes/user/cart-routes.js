import express from 'express';
import CartController from '../../controllers/user/cart-controller.js';

const router = express.Router();

router.route("/add").post(CartController.addToCart);
router.route("/get/:userId").get(CartController.fetchCartItem);
router.route("/update-cart").put(CartController.updateCartItem);
router.route("/delete/:userId/:productId").delete(CartController.deleteCartItem);

export default router;