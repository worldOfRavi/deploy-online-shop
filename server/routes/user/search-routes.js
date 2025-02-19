import express from 'express';
import SearchController from '../../controllers/user/search-controller.js';

const router  = express.Router();

router.route("/:keyword").get(SearchController.searchProducts)

export default router;