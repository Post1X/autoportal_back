import SubscriptionController from "../controller/SubscriptionController";

const express = require('express');

const router = express.Router();

router.get('/', SubscriptionController.checkSub);
router.get('/release', SubscriptionController.isReleased);
router.get('/info', SubscriptionController.getInfo)
router.post('/month', SubscriptionController.getSubMonth);
router.post('/year', SubscriptionController.getSubYear);
router.get('/check', SubscriptionController.checkPayment)
router.post('/approve', SubscriptionController.changeStatus);

export default router;
