import mongoose from "mongoose";
const atlas_uri = process.env.ATLAS_URI;

const connectDB = async () =>{
    try {
        await mongoose.connect(atlas_uri);
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection error", error.message);
        process.exit(0);
    }
}

export default connectDB;


