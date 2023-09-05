import PromotionsController from "../controller/PromotionsController";

const express = require('express');

const router = express.Router();

router.get('/', PromotionsController.GetPromotions)
router.post('/')

export default router;
