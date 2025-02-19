import Order from "../../models/Order.js";
import handleError from "../../utils/error.js";

class AdminOrderController {
    // function to fetch all the order by all users
    static async getAllOrderOfAllUsers(req, res, next) {
        try {
          const orders = await Order.find();
          if (!orders.length) next(handleError(404, "No order found"));
    
          res.status(200).json({
            success: true,
            data: orders,
          });
        } catch (error) {
          console.log("Error while fetching orders ", error.message);
          next(error);
        }
      }

    //   fyunction to get the order details
      static async getOrderDetails(req, res, next) {
        try {
          const { id } = req.params;
          const order = await Order.findById(id);
          if (!order) next(handleError(404, "No order found"));
    
          res.status(200).json({
            success: true,
            data: order,
          });
        } catch (error) {
          console.log("Error while fetching order details ", error.message);
          next(error);
        }
      }

      // update order status controller
      static async updateOrderStatus(req, res, next){
        try {
          const { id } = req.params;
          const {orderStatus} = req.body;
          const order = await Order.findById(id);
          if (!order) next(handleError(404, "No order found"));

          await Order.findByIdAndUpdate(id, {orderStatus});

          res.status(200).json({
            success:true,
            message:"Order status updated successfully"
          })
        } catch (error) {
          console.log("Error while updating order status ", error.message);
          next(error);
        }
      }
}

export default AdminOrderController;