import express from 'express';
import OrderController from '../../controllers/user/Order-Controller.js';

const route = express.Router();

route.route("/create").post(OrderController.createOrder)
route.route("/capture").post(OrderController.capturePayment)
route.route("/fetch/:userId").get(OrderController.getAllOrderByUser)
route.route("/get/:id").get(OrderController.getOrderDetails)

export default route;