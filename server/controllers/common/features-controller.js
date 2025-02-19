import FeatureImage from "../../models/FeatureImage.js";
import handleError from "../../utils/error.js";
class FeaturesImageController{
    // function to add feature image
    static async addFeatureImage(req, res, next){
        try {
            
            const {image} = req.body;
            if(!image) return next(handleError(400, "Image is required"));

            const featureImage = await FeatureImage.create({image});

            res.status(201).json({
                success:true,
                data:featureImage
            })
        } catch (error) {
            console.log("Error while adding feature image");
            next(error)
        }
    }

    // function to get all feature images
    static async getFeatureImages(req, res, next){
        try {
            const featureImages = await FeatureImage.find();
            res.status(200).json({
                success:true,
                data:featureImages
            })
        } catch (error) {
            console.log("Error while fetching feature images");
            next(error)
        }
    }
// delete featured image
    static async deleteFeatureImage(req, res, next){
        try {
            const {imageId} = req.params;
            
            const image = await FeatureImage.findByIdAndDelete(imageId);
            if(!image) return next(404, "Image is not found")
            res.status(200).json({
                success:true,
                message:"Feature Image is deleted successfully"
            })
        } catch (error) {
            console.log("Error while fetching feature images");
            next(error)
        }
    }
}

export default FeaturesImageController;