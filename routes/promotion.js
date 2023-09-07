import PromotionsController from "../controller/PromotionsController";

const express = require('express');

const router = express.Router();

router.get('/', PromotionsController.GetPromotions)
router.post('/', PromotionsController.CreatePromotion)
router.put('/', PromotionsController.updatePromotions)
router.delete('/', PromotionsController.DeletePromotion)

export default router;
