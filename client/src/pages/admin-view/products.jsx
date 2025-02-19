import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { Fragment, useEffect, useState } from "react";
import { addProductFormElements } from "../../config/index";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice";
import { useToast } from "@/hooks/use-toast";
import ProductTile from "./Product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  // product image upload component is separate from this file but the state is managed in this file
  const [imageFile, setImageFile] = useState(null);
  // url of lastly uploaded file
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  // state to hold the product id to be edited
  const [currentEditedId, setCurrentEditedId] = useState(null);



  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProductReducer);

  const { toast } = useToast();

  const handleCreateNewProduct = (event) => {
    event.preventDefault();
    // if is it in editing mode call editproduct api or else call add addNewProductAPI
    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData })).then(
          (data) => {
            if (data?.payload?.success) {
              toast({
                title: data?.payload?.message,
              });
              dispatch(fetchAllProducts());
              setCurrentEditedId(null);
              setFormData(initialFormData);
              setOpenCreateProductDialog(false);
              setImageFile(null)
              setUploadedImageUrl("")
            }
          }
        )
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            toast({
              title: data?.payload?.message,
            });
            setUploadedImageUrl("");
            setFormData(initialFormData);
            setOpenCreateProductDialog(false);
            dispatch(fetchAllProducts());
            setImageFile(null)
          } else {
            toast({
              title: "Something went wrong...",
              variant: "destructive",
            });
          }
        });
  };

  // function to check if all the form's fields are filled or not
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  // function to delete a product
  function deleteSelectedProduct(getProductId){
    
    dispatch(deleteProduct(getProductId)).then((data)=>{
      
      if(data?.payload?.success){
        toast({
          title:data?.payload?.message
        })
        dispatch(fetchAllProducts())
      }
    })
  }

  // fetch all product data
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="flex mb-5 justify-end w-full">
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Products will appear here */}
        {productList && productList.length > 0
          ? productList.map((productItem, id) => (
              <ProductTile
                key={id.toString()}
                setFormData={setFormData}
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductDialog={setOpenCreateProductDialog}
                product={productItem}
                deleteProduct={deleteSelectedProduct}
              />
            ))
          : ""}
      </div>
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => {
          setOpenCreateProductDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {/* image upload component */}
            <ProductImageUpload
              file={imageFile}
              setFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              isEditedMode={currentEditedId !== null}
            />
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateNewProduct}
              buttonText={currentEditedId ? "Edit Product" : "Add Product"}
              isButtonDisabled = {!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
