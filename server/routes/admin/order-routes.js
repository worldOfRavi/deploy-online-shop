import express from 'express';
import AdminOrderController from '../../controllers/admin/order-controller.js';

const route = express.Router();


route.route("/get").get(AdminOrderController.getAllOrderOfAllUsers)
route.route("/details/:id").get(AdminOrderController.getOrderDetails)
route.route("/update/:id").put(AdminOrderController.updateOrderStatus)

export default route;