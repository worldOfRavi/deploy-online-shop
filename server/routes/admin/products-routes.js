import express from 'express';
import { addProduct, deleteProducts, editProducts, fetchAllProducts, handleImageUpload } from '../../controllers/admin/products-controller.js';
import { upload } from '../../helpers/cloudinary.js';

const router = express.Router();

router.route("/upload-image").post( upload.single("my_file") ,handleImageUpload);
router.route("/add").post(addProduct);
router.route("/get").get(fetchAllProducts);
router.route("/edit/:id").put(editProducts);
router.route("/delete/:id").delete(deleteProducts);

export default router;
