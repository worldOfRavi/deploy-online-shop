import Product from "../../models/Product.js";
import handleError from "../../utils/error.js";

class UserProductController{
    static async getFilteredProducts(req, res, next){
        try {
            const {category=[], brand=[], sortBy} = req.query;
            
            let filters = {};

            if(category.length){
                filters.category = {$in :category.split(",")}
            }

            if(brand.length){
                filters.brand = {$in : brand.split(",")}
            }

            let sort = {};

            switch(sortBy){
                case "price-lowtohigh" :
                sort.price = 1
                break;
                case "price-hightolow" :
                sort.price = -1
                break;
                case "title-atoz":
                sort.title = 1
                break;
                case "title-ztoa":
                sort.title = -1
                break;

                default:
                sort.price = 1
                break
            }

            const products = await Product.find(filters).sort(sort);
            res.status(200).json({
                success:true,
                data:products
            })
        } catch (error) {
            console.log("error while fetching products by user ", error.message);
            next(error)
        }
    }

    static async getProductDetail(req, res, next){
        try {
            const {id} = req.params;
            
            const product = await Product.findById({_id:id});
            if(!product){
                return next(handleError(404,"Product not found"));
            }

            res.status(200).json({
                success:true,
                data:product
            })
        } catch (error) {
            console.log("Error while fetching product details ", error.message);
            next(error)
            
        }
    }
}
export default UserProductController;