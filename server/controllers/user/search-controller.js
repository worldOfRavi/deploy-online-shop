import Product from "../../models/Product.js";
import handleError from "../../utils/error.js";
class SearchController {
  static async searchProducts(req, res, next) {
    try {
      const { keyword } = req.params;
      // console.log(keyword);

      if (!keyword || typeof keyword !== "string") {
        return handleError(400, "Keyword is required and must be string");
      }
      const regEx = new RegExp(keyword, "i");

      const createSearchQuary = {
        $or: [
          { title: regEx },
          { description: regEx },
          { category: regEx },
          { brand: regEx },
        ],
      };

      const searchResult = await Product.find(createSearchQuary);
      res.status(200).json({
        success:true,
        data : searchResult
      })

    } catch (error) {
      console.log("Error occured while seaching the products ", error.message);
      next(error);
    }
  }
}

export default SearchController;
