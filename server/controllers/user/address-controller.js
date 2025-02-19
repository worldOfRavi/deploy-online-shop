import Address from "../../models/Address.js";
import handleError from "../../utils/error.js";

// address controller class
class AddressController {
  // function to add address
  static async addAddress(req, res, next) {
    try {
      const { userId, address, city, pincode, phone, notes } = req.body;
      if (!userId || !address || !city || !pincode || !phone || !notes) {
        return next(handleError(400, "Invalid data provided"));
      }

      const newlyAddress = new Address({
        userId,
        address,
        city,
        pincode,
        phone,
        notes,
      });
      await newlyAddress.save();

      res.status(201).json({ success: true, data: newlyAddress });
    } catch (error) {
      console.log("Error while adding address ", error.message);
      next(error);
    }
  }

  // function to detch address
  static async fetchAllAddress(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) return next(handleError(400, "UserId is required"));

      const addressList = await Address.find({ userId });

      res.status(200).json({ success: true, data: addressList });
    } catch (error) {
      console.log("Error while fetching address ", error.message);
      next(error);
    }
  }

  // function to edit or update the address
  static async updateAddress(req, res, next) {
    try {
      const { userId, addressId } = req.params;
      const formData = req.body;
      if (!userId || !addressId)
        return next(handleError(400, "User and address id are required"));

      const address = await Address.findOneAndUpdate(
        { _id: addressId, userId },
        // formData, // I could pass formData directly but for safety
        { $set: formData }, // Safely update only provided fields
        { new: true }
      );
      if (!address) return next(handleError(404, "Address not found"));

      res.status(200).json({ success: true, data: address });
    } catch (error) {
      console.log("Error while updating address ", error.message);
      next(error);
    }
  }

  // function to delete the address
  static async deleteAddress(req, res, next) {
    try {
        const { userId, addressId } = req.params;
      if (!userId || !addressId)
        return next(handleError(400, "User and address id are required"));

      const address = await Address.findOneAndDelete({_id:addressId, userId});
      if (!address) return next(handleError(404, "Address not found"));
      res.status(200).json({ success: true, message:"Address deleted successfully" });


    } catch (error) {
      console.log("Error while adding address ", error.message);
      next(error);
    }
  }
}

export default AddressController;
