import { imageUploadUtils } from "../../helpers/cloudinary.js";
import Product from "../../models/Product.js";
import handleError from "../../utils/error.js";

export const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(handleError(400, "No file uploaded."));
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtils(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// add a new product

export const addProduct = async (req, res, next) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newProduct = await Product.create({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    res.status(201).json({
        success:true,
        message:"Product added successfully",
        data:newProduct
    })
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// fetch all product

export const fetchAllProducts = async(req, res, next) => {
  try {
    const listOfProduct = await Product.find({});
    res.status(200).json({
        success:true,
        data:listOfProduct
    })
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// edit a product
export const editProducts = async(req, res, next) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProduct = await Product.findById({_id:id});
    

    if(!findProduct) return handleError(404, "Product not found");

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price  || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;

    await findProduct.save();

    res.status(200).json({
        success:true,
        message:"Product is updated successfully"
    })
    

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// delete a product
export const deleteProducts = async(req, res, next) => {
  try {
    const {id}  = req.params;
    const product = await Product.findByIdAndDelete({_id:id});

    if(!product) return handleError(404, "Product not found");

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
