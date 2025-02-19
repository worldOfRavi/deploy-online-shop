import {Schema, model} from 'mongoose';

const productReviewSchema = new Schema({
    productId : String,
    userId : String,
    userName : String,
    reviewMessage : String,
    reviewValue : Number
},{timestamps:true});


const ProductReview = model("ProductReview", productReviewSchema);

export default ProductReview;