import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import React from "react";
import UserCartItemsContent from "./cart-items-contens";
import { useNavigate } from "react-router-dom";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();

  // total Cart items price
  const totalCartItemAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className=" sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      {/* cart items */}
      <div className="mt-8 space-y-4">
        {cartItems &&
          cartItems.length > 0 &&
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">total</span>
          <span className="font-bold">${totalCartItemAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/user/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
};

export default UserCartWrapper;
