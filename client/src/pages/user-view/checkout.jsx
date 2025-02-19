import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/user-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "./cart-items-contens";
import { Button } from "@/components/ui/button";
import { createOrderPayment } from "@/store/user/order-slice";
import { useToast } from "@/hooks/use-toast";
const UserCheckout = () => {
  // cart items
  const { cartItems,cartId } = useSelector((state) => state.cartSlice);
  const { user } = useSelector((state) => state.authReducer);
  const { approvedURL } = useSelector((state) => state.orderSlice);
  const {toast} = useToast();
  

  const [addressInfo, setAddressInfo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);

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

  function handleInitialPaypalPayment() {

    if(cartItems.length === 0){
      toast({
        title:"Your cart is empty, please add item first",
        variant:"destructive"
      })
      return
    } 

    if(addressInfo === null){
      toast({
        title:"Please select one address to proceed...!",
        variant:"destructive"
      })
      return
    }

    const orderData = {
      userId: user?.id,
      cartId,
      cartItems: cartItems.map((singleCartItem) => ({
        productId: singleCartItem.productId,
        title: singleCartItem.title,
        image: singleCartItem.image,
        price:
          singleCartItem.salePrice > 0
            ? singleCartItem.salePrice
            : singleCartItem.price,
        quantity: singleCartItem.quantity,
      })),
      addressInfo: {
        addressId: addressInfo?._id,
        address: addressInfo?.address,
        city: addressInfo?.city,
        pincode: addressInfo?.pincode,
        phone: addressInfo?.phone,
        notes: addressInfo?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartItemAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createOrderPayment(orderData)).then((data) => {
      console.log(data);
      if(data?.payload?.success){
        setIsPaymentStart(true)
      }else setIsPaymentStart(false);
    })
  }
  // if everything goes well and able to get the approvedURL then, it will be redirected to the paypal.
  if(approvedURL){
      window.location.href = approvedURL;
    }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={img}
          alt="cover image"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
        <Address selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} setAddressInfo={setAddressInfo} />
        <div className="flex flex-col gap-5 p-5">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))
          ) : (
            <p>You don't have any item in your cart</p>
          )}
          {/* total price */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">total</span>
              <span className="font-bold">${totalCartItemAmount}</span>
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={handleInitialPaypalPayment} className="w-full">
             {isPaymentStart ? "Processing Paypal Payment..." : "Checkout with Paypal"} 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCheckout;
