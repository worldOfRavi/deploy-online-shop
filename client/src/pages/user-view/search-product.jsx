import { Input } from "@/components/ui/input";
import { resetSearchResult, searchProduct } from "@/store/user/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import UserProductTile from "./product-tile";
import { useToast } from "@/hooks/use-toast";
import { addToCartItem, fetchCartItems } from "@/store/user/cart-slice";
import ProductDetailsDialog from "./product-details";
import { fetchProductDetail } from "@/store/user/product-slice";

const SearchProduct = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResult } = useSelector((state) => state.searchSlice);
  const { cartItems } = useSelector((state) => state.cartSlice);

  const { user } = useSelector((state) => state.authReducer);
  const { toast } = useToast();

    const {productDetails } = useSelector(
      (state) => state.userProductReducer
    );

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    

  // function to handle addtocart item
  function handleAddTocart(getProductId, getTotalStock) {
    let getCartItems = cartItems || []; //if the cartItems is empty then it would be empty array

    if (getCartItems.length) {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getProductId
      );
      if (indexOfCurrentCartItem > -1) {
        if (getCartItems[indexOfCurrentCartItem].quantity + 1 > 5) {
          toast({
            title: `You can add only 5 items at once`,
            variant: "destructive",
          });
          return;
        }
        if (getCartItems[indexOfCurrentCartItem].quantity + 1 > getTotalStock) {
          toast({
            title: `We have only ${getTotalStock} items`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCartItem({ userId: user?.id, productId: getProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Item added to your cart",
        });
      }
    });
  }

   // function to get the product details
    const handleProductDetails = (getProductId) => {
      dispatch(fetchProductDetail(getProductId));
    };

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length >= 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(searchProduct(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResult());
    }
  }, [keyword]);

  // when ever the productDetails changes, openDetailsDialog will be true and the productDetailsDialog would appear
    useEffect(() => {
      if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);
  

//   console.log(searchResult, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            className="py-6"
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Products..."
          />
        </div>
      </div>
      {searchResult.length === 0 && (
        <h1 className="text-5xl font-extrabold w-full">No Result found</h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResult &&
          searchResult.length > 0 &&
          searchResult.map((item) => (
            <UserProductTile
              key={item._id}
              product={item}
              handleAddTocart={handleAddTocart}
              handleProductDetails={handleProductDetails}
            />
          ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddTocart={handleAddTocart}
      />
    </div>
  );
};

export default SearchProduct;
