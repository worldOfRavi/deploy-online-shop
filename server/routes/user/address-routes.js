import express from 'express';
import AddressController from '../../controllers/user/address-controller.js';

const router = express.Router();

router.route("/add").post(AddressController.addAddress);
router.route("/get/:userId").get(AddressController.fetchAllAddress);
router.route("/update/:userId/:addressId").put(AddressController.updateAddress);
router.route("/delete/:userId/:addressId").delete(AddressController.deleteAddress);

export default router;

