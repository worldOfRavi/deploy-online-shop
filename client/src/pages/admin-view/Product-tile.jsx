import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React from 'react'
const ProductTile = ({product, setFormData, setCurrentEditedId, setOpenCreateProductDialog, deleteProduct}) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
        <div className="">
            <div className="relative">
                <img src={product.image} 
                alt={product.title}
                className='w-full h-[300px] object-cover rounded-t-lg'  />
            </div>
            <CardContent>
                <h2 className='text-lg font-bold mb-2 mt-2'>{product.title}</h2>
                <div className="flex justify-between items-center">
                    <span className={`${product.salePrice > 0 ? "line-through" : ""} text-md font-semibold text-primary` }>${product.price}</span>
                    {
                        product.salePrice > 0 ? <span className='text-md font-bold'>${product.salePrice}</span> : ""
                    }
                </div>
            </CardContent>
            <CardFooter className="flex, justify-between items-center">
                <Button onClick={()=>{
                    setOpenCreateProductDialog(true);
                    setCurrentEditedId(product._id);
                    setFormData(product)
                }}>Edit</Button>
                <Button className="bg-red-800" onClick={()=>{
                    deleteProduct(product._id)
                }}>Delete</Button>
            </CardFooter>
        </div>
    </Card>
  )
}

export default ProductTile
