import paypal from "../../helpers/Paypal.js";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import handleError from "../../utils/error.js";

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const {
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      } = req.body;

      //   creating payment json
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `${process.env.CLIENT_BASE_URL}/user/paypal-return`, //when the payment is initiated, then our app exit and redirected to approvalLink and come back to paypal-return page
          cancel_url: `${process.env.CLIENT_BASE_URL}/user/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map((item) => ({
                name: item.title,
                sku: item.productId,
                price: Number(item.price || 0).toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: Number(totalAmount || 0).toFixed(2),
            },
            description: "description",
          },
        ],
      };

      //   // Create payment instance
      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.log("Error while making payment instance ", error.message);
          // next handleError(500, "Payment Error")
          res.status(500).json({
            success: false,
            message: "Error while creating paypal payment",
          });
        } else {
          // Check for approval URL
          const approvalLink = paymentInfo.links?.find(
            (link) => link.rel === "approval_url"
          );
          if (!approvalLink) {
            return res
              .status(500)
              .json({ success: false, message: "Approval URL not found" });
          }
          const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
          });

          await newlyCreatedOrder.save();

          res.status(201).json({
            success: true,
            approvedURL: approvalLink.href,
            orderId: newlyCreatedOrder._id,
          });
        }
      });
    } catch (error) {
      console.log("Error while creating new order ", error.message);
      next(error);
    }
  }

  static async capturePayment(req, res, next) {
    try {
      const { paymentId, payerId, orderId } = req.body;
      let order = await Order.findById(orderId);
      if (!order) return handleError(404, "Order cannot be found");

      // after getting the order update the remaining attributes then save it.
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;

      await order.save();

      // after the order is place, we have to delete the items from the cart. for that get the cartId from the order and delete it from the cart Model
      const getCartId = order.cartId;

      await Cart.findByIdAndDelete(getCartId);

      /*
      we after the order is made, we have to reduce the item quantity from the product stock for that, we get the cartItems from the
      order then get the product with its id, and reduce the order item quantity from the total stock.
      
      */ 
      for(let item of order.cartItems){
        const product = await Product.findById(item.productId);
        
          if(!product) next(handleError(404, `Not enough item in the stock of ${item.title}`));
          product.totalStock -= item.quantity;
          await product.save();
      }

      res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } catch (error) {
      console.log("Error while capturing the payment ", error.message);
      next(error);
    }
  }

  static async getAllOrderByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId });
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
}

export default OrderController;
