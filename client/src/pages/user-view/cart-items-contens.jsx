import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteCartItem, updateCartItems } from "@/store/user/cart-slice";
import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.authReducer);
   const { productList } = useSelector(
      (state) => state.userProductReducer
    );
  const { toast } = useToast();

  const dispatch = useDispatch();

  // function to handle cart item deletion
  function handleDeleteItem(getProductId) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getProductId }));
    toast({
      title: "Item deleted form the cart",
    });
  }

  // function to update cart item update
  function updateCartItemQuantity(getCartItem, typeOfAction) {
    if(typeOfAction === "plus"){
      const currentProduct = productList?.filter(item=>item._id ===getCartItem.productId );
      // console.log(currentProduct);
      
      if((getCartItem.quantity + 1) > 5){
        toast({
          title : `You can add only 5 items at a time`,
          variant : "destructive"
        })
        return
      }
      if((getCartItem.quantity + 1) > currentProduct[0].totalStock){
        toast({
          title : `We have only ${currentProduct[0].totalStock} item at this moment`,
          variant : "destructive"
        })
        return
      }
    }
    dispatch(
      updateCartItems({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            disabled = {cartItem?.quantity === 1}
            onClick={() => updateCartItemQuantity(cartItem, "minus")}
            variant="outline"
            className={` w-8 h-8 rounded-full`}
            size="icon"
            
          >
            <Minus className={` w-4 h-4`} />
            <span className="sr-only">decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            onClick={() => updateCartItemQuantity(cartItem, "plus")}
            variant="outline"
            className="w-8 h-8 rounded-full"
            size="icon"
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleDeleteItem(cartItem?.productId)}
          className="cursor-pointer mt-1"
          size={17}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;
