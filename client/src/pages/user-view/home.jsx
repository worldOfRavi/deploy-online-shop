import React, { useEffect, useState } from "react";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import adidas from "../../assets/adidas.webp";
import hnm from "../../assets/hnm.jpg";
import levis from "../../assets/levis.png";
import zara from "../../assets/zara.webp";
import nike from "../../assets/nike.jpg";
import puma from "../../assets/puma.webp";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import HeadsetIcon from "@mui/icons-material/Headset";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilteredProducts,
  fetchProductDetail,
} from "@/store/user/product-slice";
// import ProductTile from "../admin-view/Product-tile";
import UserProductTile from "./product-tile";
import { useNavigate } from "react-router-dom";
import ProductDetailsDialog from "./product-details";
import { addToCartItem, fetchCartItems } from "@/store/user/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { getFeatureImages } from "@/store/common-slice";

const slides = [bannerOne, bannerTwo, bannerThree];

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ManIcon },
  { id: "women", label: "Women", icon: WomanIcon },
  { id: "kids", label: "Kids", icon: ChildCareIcon },
  { id: "accessories", label: "Accessories", icon: HeadsetIcon },
  { id: "footwear", label: "Footwear", icon: SnowshoeingIcon },
];

const brandsWithIcons = [
  { id: "nike", label: "Nike", icon: nike },
  { id: "addidas", label: "Addidas", icon: adidas },
  { id: "puma", label: "Puma", icon: puma },
  { id: "levis", label: "Levi's", icon: levis },
  { id: "zara", label: "Zara", icon: zara },
  { id: "h&m", label: "H&N", icon: hnm },
];
const UserHome = () => {
  // states to handle the slides for the banner
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.userProductReducer
  );
  // console.log(productList);
  
  const { user } = useSelector((state) => state.authReducer);
  // state to manage the product details dialog
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
   const {featureImageList}  = useSelector(state=>state.commonFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast}  = useToast();

  function handleNavigateToListing(getItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilters = {
      [section]: [getItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/user/listing");
  }

  // function to get the product details
  const handleProductDetails = (getProductId) => {
    dispatch(fetchProductDetail(getProductId));
  };

  // function to handle addtocart item
  function handleAddTocart(getProductId) {
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

  // useEffect hook with setInterval method for automatic slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);

    // 
    return () => clearInterval(timer);
  }, [featureImageList]);

  // fetching filtered data
  useEffect(() => {
    dispatch(
      fetchFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, []);

  // when ever the productDetails changes, openDetailsDialog will be true and the productDetailsDialog would appear
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  //fetching featured images 
   useEffect(()=>{
      dispatch(getFeatureImages())
    },[dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* banner section start*/}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length>0 &&  featureImageList.map((banner, index) => (
          <img
            key={index}
            src={banner.image}
            alt="Banner"
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000  `}
          />
        ))}
        <Button
          onClick={() =>
            setCurrentSlide(
              (preSlide) => (preSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      {/* banner section end*/}

      {/* category section start */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListing(categoryItem, "category")
                }
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col justify-center items-center p-6">
                  <categoryItem.icon
                    fontSize="large"
                    className="w-15 h-15 mb-4 text-primary"
                  />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by brand */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcons.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListing(brandItem, "brand")}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col justify-center items-center p-6">
                  <img
                    src={brandItem.icon}
                    alt={brandItem.title}
                    className="w-10 h-10"
                  />
                  {/* <brandItem.icon
                    fontSize="large"
                    className="w-15 h-15 mb-4 text-primary"
                  /> */}
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* feature product section */}
      <section className="py-12">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <UserProductTile
                    key={productItem._id}
                    product={productItem}
                    handleProductDetails={handleProductDetails}
                    handleAddTocart={handleAddTocart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      {/* product details */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default UserHome;
