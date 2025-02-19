import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import handleError from "../../utils/error.js";

class CartController {
  // function to add item to cart
  static async addToCart(req, res, next) {
    try {
      const { userId, productId, quantity } = req.body;

      // if any of them does not present return wiith an error
      if (!userId || !productId || quantity <= 0) {
        return next(handleError(400, "Invalid data provided"));
      }

      const product = await Product.findById(productId);

      if (!product) return next(handleError(404, "Product not found"));

      let cart = await Cart.findOne({ userId });

      // if there is not cart for a user, then new cart will be created before adding any item to cart
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      //  see if the item that a user want to add to the cart,    already present in the cart or not?
      // for that find the index of the item in the cart, it does not present then the index will be -1

      // find the index of the item in items array
      const findCurrentProductIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      // if the index is -1 that is the item is not cart - push the item with the product id in the cart
      if (findCurrentProductIndex === -1) {
        cart.items.push({ productId, quantity });
      }
      // if item already present in the cart, then simply increment the quantity
      else {
        cart.items[findCurrentProductIndex].quantity += quantity;
      }

      await cart.save();

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      console.log("Error while adding to product to cart ", error.message);
      next(error);
    }
  }

  // function to fetch cart items
  static async fetchCartItem(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) return next(handleError(404, "User id is mandatory"));

      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId", // Specifies the nested path to populate (items -> productId)
        select: "image title price salePrice", //Includes only these fields from the `Product` collection
      });

      /*
            after populate, cart would look like 
            {
  items: [
    { 
      productId: {
        image: "url_to_image",
        title: "Product Name",
        price: 100,
        salePrice: 80
      }, 
      quantity: 2 
    }
  ]
}

            */

      if (!cart) return next(handleError(404, "Cart is not found"));

      // console.log(cart.items, " fetch products");

      // very important
      /*
            we need to validate the case, if an item present in the cart but for some reason, if admin remove that item from the database
            then it should not present in the cart as well
            */

      const validateItems = cart.items.filter(
        (productItem) => productItem.productId
      );

      if (validateItems.length < cart.items.length) {
        cart.items = validateItems;
        await cart.save();
      }

      //   dont be confuse, here item.productId contains all the product information related with the specified productId.
      const populateCartItem = validateItems.map((item) => ({
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
      }));

      res.status(200).json({
        success: true,
        data: {
          ...cart._doc,
          items: populateCartItem,
        },
      });
    } catch (error) {
      console.log("Error while fetching item from cart ", error.message);
      next(error);
    }
  }

  // function to update cart item
  static async updateCartItem(req, res, next) {
    try {
      const { userId, productId, quantity } = req.body;

      // if any of them does not present return wiith an error
      if (!userId || !productId || quantity <= 0) {
        return next(handleError(400, "Invalid data provided"));
      }

      const cart = await Cart.findOne({ userId });

      if (!cart) return next(handleError(404, "Cart is not found"));

      const findCurrentProductIndex = cart.items.findIndex(
        (item) => item.productId._id.toString() === productId
      );

      if (findCurrentProductIndex === -1)
        return next(handleError(404, "cart item not present"));

      cart.items[findCurrentProductIndex].quantity = quantity;

      await cart.save();

      await cart.populate({
        path: "items.productId",
        select: "image title price salePrice",
      });

      const populateCartItem = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : "Product not found",
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity,
      }));

      res.status(200).json({
        success: true,
        data: {
          ...cart._doc,
          items: populateCartItem,
        },
      });
    } catch (error) {
      console.log("Error while updating item of cart ", error.message);
      next(error);
    }
  }

  // function to delete cart item
  static async deleteCartItem(req, res, next) {
    try {
      const { userId, productId } = req.params;
      

      // if any of them does not present return wiith an error
      if (!userId || !productId) {
        return next(handleError(400, "Invalid data provided"));
      }

      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "image title price salePrice",
      });


      if (!cart) return next(handleError(404, "Cart is not found"));

      // return the items that are not matched with the product id got from the front end.
      // console.log(cart.items[0].productId._id, "fetch items");

      // cart.items = cart.items.map(item => item.productId._id.toString() !== productId);
      cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);

      
      await cart.save();


      const populateCartItem = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : "Product not found",
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity,
      }));

      res.status(200).json({
        success: true,
        data: {
          ...cart._doc,
          items: populateCartItem,
        },
      });
    } catch (error) {
      console.log("Error while deleting cart item ", error.message);
      next(error);
    }
  }
}

export default CartController;
