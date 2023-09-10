import SubscriptionController from "../controller/SubscriptionController";

const express = require('express');

const router = express.Router();

router.get('/', SubscriptionController.checkSub);
router.post('/month', SubscriptionController.getSubMonth);
router.post('/year', SubscriptionController.getSubYear);

export default router;
