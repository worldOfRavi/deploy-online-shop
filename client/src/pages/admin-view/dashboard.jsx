import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
  // product image upload component is separate from this file but the state is managed in this file
  const [imageFile, setImageFile] = useState(null);
  // url of lastly uploaded file
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleFeatureImageUpload() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "Feature image uploaded successfully",
        });
        dispatch(getFeatureImages());
      }
    });
  }
  const handleDeleteFeatureImage = (getImageId) =>{
    dispatch(deleteFeatureImage(getImageId)).then(data=>{
      if(data?.payload?.success){
        toast({
          title:data?.payload?.message
        })
        dispatch(getFeatureImages());
      }
    })
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);


  return (
    <div>
      <ProductImageUpload
        file={imageFile}
        setFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        curstomStyle={true}
      />
      <Button
        onClick={handleFeatureImageUpload}
        className="w-full"
        disabled={uploadedImageUrl === ""}
      >
        Uplaod Image
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featuredItem) => (
              <div key={featuredItem._id} className="relative">
                <img
                  src={featuredItem?.image}
                  alt={featuredItem?.title}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <Button onClick={()=>{handleDeleteFeatureImage(featuredItem._id)}} className="absolute top-[10px] right-[10px] bg-red-500"><XIcon className="w-10 h-10" /></Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
