import mongoose, { Schema, model } from 'mongoose';

const addressSchema = new Schema({
    userId: String,
    address : String,
    city : String,
    pincode : String,
    phone : String,
    notes : String
},{timestamps : true});


const Address = model("Address", addressSchema);

export default Address;
