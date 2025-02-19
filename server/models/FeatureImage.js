import mongoose, { model, Schema } from 'mongoose';

// creatig schema
const featureImageSchema = new Schema({
image : String
},{timestamps:true})

// creating model
const FeatureImage = model("FeatureImage", featureImageSchema);

// exporting model
export default FeatureImage;