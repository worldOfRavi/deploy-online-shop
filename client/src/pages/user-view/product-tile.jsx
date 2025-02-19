import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandFilterMap, categoryFilterMap } from "@/config";
import React from "react";

const UserProductTile = ({ product, handleProductDetails, handleAddTocart }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="cursor-pointer" onClick={()=>handleProductDetails(product._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock <=  10 && product?.totalStock >=1   ? (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} item left`}
            </Badge>
          ) : product?.totalStock ===  0 ? (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              Out of stock
            </Badge>) : null}

          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{product.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] text-muted-foreground">
                {categoryFilterMap[product?.category]}
              </span>
              <span className="text-[16px] text-muted-foreground">
                {brandFilterMap[product?.brand]}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className=" text-lg font-semibold text-primary">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </CardContent>
        </div>
      </div>
      <CardFooter>
            <Button onClick={()=>handleAddTocart(product?._id, product?.totalStock)} disabled={product?.totalStock ===  0} className={` w-full`}>{product?.totalStock ===  0 ? "Out of stock" : "Add to cart"}</Button>
          </CardFooter>
    </Card>
  );
};

export default UserProductTile;
