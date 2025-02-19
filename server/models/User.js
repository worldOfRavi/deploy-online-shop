import mongoose, { model, Schema } from 'mongoose';

// creatig schema
const userSchema = new Schema({
userName:{
    type:String,
    required:true,
    // unique:true
},
email:{
    type:String,
    required:true,
    // unique:true
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
    default:'user'
}
},{timestamps:true})

// creating model
const User = model("User", userSchema);

// exporting model
export default User;