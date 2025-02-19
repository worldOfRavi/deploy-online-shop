import express from 'express';
import FeaturesImageController from '../../controllers/common/features-controller.js';

const router = express.Router();

router.route("/add").post(FeaturesImageController.addFeatureImage);
router.route("/get").get(FeaturesImageController.getFeatureImages);
router.route("/delete/:imageId").delete(FeaturesImageController.deleteFeatureImage);

export default router;