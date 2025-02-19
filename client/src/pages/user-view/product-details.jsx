import StarRatingComponent from "@/components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { addToCartItem, fetchCartItems } from "@/store/user/cart-slice";
import { setOpenProductDetails } from "@/store/user/product-slice";
import {
  addProductReview,
  fetchProductReview,
} from "@/store/user/review-slice";
import { StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductDetailsDialog = ({
  open,
  setOpen,
  productDetails,
  handleAddTocart,
}) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const { reviewList } = useSelector((state) => state.reviewSlice);
  const { toast } = useToast();

  //  function to handle the rating
  function handleRating(getRating) {
    setRating(getRating);
  }

  // function to add review to a product
  function handleAddReview() {
    const formData = {
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    };
    dispatch(addProductReview(formData)).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(fetchProductReview(productDetails?._id));
        toast({
          title: "Review added successfullly",
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  // here handleProductDetailsDialog funtion set the setOpen to false which closes the dialog, but the productDetails will remain same as the last product that has been clicked, so when we come back to listing page from some other page, the productDetails would appear by its on. so to make the productDetails to null, call setOpenProductDetails function which is defined in the userProduct slice.
  function handleProductDetailsDialog() {
    setOpen(false);
    dispatch(setOpenProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  


  useEffect(() => {
    if (productDetails !== null)
      dispatch(fetchProductReview(productDetails?._id));
  }, [productDetails]);

  // calcultate average review of the particular product
  const averageReview =
    reviewList && reviewList.length > 0
      ? reviewList.reduce((sum, review) => sum + review.reviewValue, 0) /
        reviewList.length
      : 0;


  return (
    <Dialog open={open} onOpenChange={handleProductDetailsDialog}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] ">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover "
          />
        </div>
        <div className="">
          <div className="">
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">({averageReview.toFixed(1)})</span>
          </div>
          <div className="mt-5 mb-4">
            <Button
              disabled={productDetails?.totalStock === 0}
              onClick={() =>
                handleAddTocart(productDetails?._id, productDetails?.totalStock)
              }
              className="w-full"
            >
              {productDetails?.totalStock === 0
                ? "Out of stock"
                : "Add to Cart"}
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviewList && reviewList.length > 0 ? (
                reviewList.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="foint-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Review yet...</p>
              )}
            </div>
            <div className="flex mt-10 gap-2 flex-col">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRating={handleRating}
                />
              </div>
              <Input
                name="review"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
