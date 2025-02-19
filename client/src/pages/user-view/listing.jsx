import React, { useEffect, useState } from "react";
import ProductFilter from "./filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import UserProductTile from "./product-tile";
import {
  fetchFilteredProducts,
  fetchProductDetail,
} from "@/store/user/product-slice";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "./product-details";
import { addToCartItem, fetchCartItems } from "@/store/user/cart-slice";
import { useToast } from "@/hooks/use-toast";

const UserListing = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.userProductReducer
  );

  const { cartItems } = useSelector(
    (state) => state.cartSlice
  );
  // console.log(cartItems, "cartItems");
  

  const { user } = useSelector((state) => state.authReducer);
  const { toast } = useToast();

  // state to holds the filter options
  const [filters, setFilters] = useState({});

  // state to hold the sort option
  const [sort, setSort] = useState(null);
  // useSearchPrams hook to manage the URL
  const [searchParams, setSearchParams] = useSearchParams();

  /*
  when we click on some particular nav button, the url search params get changed which is handled in header component.
  const categoryFilter = searchParams.get("category");
  this give the category on which use clicked on, based on that we have to show the product which is used in dependency array while calling the filter function
  */
  const categoryFilter = searchParams.get("category");

  // state to manage the product details dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // function to handle the changes in sort options
  function handleSort(value) {
    setSort(value);
  }

  // function to handle the change in filter options
  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    // find the category if it present in the filter object or not, if not set the getSectionId as key and  getCurrentOption in an array as value of object
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };

      // but if the getSectionId already present in the object then it checks if the option is present in the value array or not, if not it push it to the array or else delete it from the object.
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFilters);
    // set the filter object to the sessionStorage, so that when the page gets refreshed, it will remain in the in object
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  // helper function to create query string for URL
  function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    // seperate the filterParams into key and value
    for (const [key, value] of Object.entries(filterParams)) {
      // check if the value is an array and holds element or not
      if (Array.isArray(value) && value.length > 0) {
        // if value array holds elements, it is joined to a single string separated by comma(,)
        const paramValue = value.join(",");
        // push key value pair into queryParams, here encodeURIComponent(paramValue) ensures that special characters in the string (like spaces, &, ?, etc.) are properly encoded for inclusion in a URL
        // Example: "electronics,clothing" becomes "electronics%2Cclothing"
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    // returns the queryParams array as a single string seperated by and(&)
    return queryParams.join("&");
  }

  // function to get the product details
  const handleProductDetails = (getProductId) => {
    dispatch(fetchProductDetail(getProductId));
  };

  // function to handle addtocart item
  function handleAddTocart(getProductId, getTotalStock) {
  let getCartItems = cartItems || []; //if the cartItems is empty then it would be empty array

  if(getCartItems.length){
    const indexOfCurrentCartItem = getCartItems.findIndex((item)=>item.productId === getProductId);
    if(indexOfCurrentCartItem > -1){
      if((getCartItems[indexOfCurrentCartItem].quantity +1) > 5){
        toast({
          title:`You can add only 5 items at once`,
          variant:"destructive"
        })
        return
      }
      if((getCartItems[indexOfCurrentCartItem].quantity +1) > getTotalStock){
        toast({
          title:`We have only ${getTotalStock} items`,
          variant:"destructive"
        })
        return
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

  // to set the default value for the filters of sort when the page load for the first time or when the page got refreshed.
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categoryFilter]);

  // fetch all list of product based on given sorting
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, filters, sort]);

  // use of useSearchParams to change the url when filtering or sorting the products
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      // URLSearchParams create new URL and setSearchParams changes the URL
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  // when ever the productDetails changes, openDetailsDialog will be true and the productDetailsDialog would appear
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // console.log(productList, "productList");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 ">
      {/* ProductFilter component holds the sidebar filter options */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm ">
        {/* this part contains the product count and sort options  */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{`${productList?.length} ${
              productList?.length > 1 ? "Products" : "Product"
            }`}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* this part contains the available products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
          {productList &&
            productList?.length > 0 &&
            productList.map((product) => (
              <UserProductTile
                handleProductDetails={handleProductDetails}
                key={product.title}
                product={product}
                handleAddTocart={handleAddTocart}
              />
            ))}
        </div>
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

export default UserListing;
