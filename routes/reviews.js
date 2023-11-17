import ReviewsController from "../controller/ReviewsController";
import is_banned from "../middlewares/is_banned";

const express = require('express');

const router = express.Router();

router.post('/', is_banned, ReviewsController.createReview);
router.get('/', ReviewsController.getReviews)
router.post('/', is_banned, ReviewsController.updateReview)
export default router;
