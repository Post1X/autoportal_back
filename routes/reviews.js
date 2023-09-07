import ReviewsController from "../controller/ReviewsController";

const express = require('express');

const router = express.Router();

router.post('/', ReviewsController.createReview)
router.get('/', ReviewsController.getReviews)
router.post('/', ReviewsController.updateReview)
export default router;
