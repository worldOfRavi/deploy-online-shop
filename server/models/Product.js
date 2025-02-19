
import { Schema, model} from 'mongoose';

const productSchema = new Schema({
   image : String,
   title : String,
   description : String,
   category : String,
   brand : String,
   price : Number,
   salePrice : Number,
   totalStock : Number
}, {timestamps : true});


const Product =  model("Product", productSchema);

export default Product;