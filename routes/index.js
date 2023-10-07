import organisations from "./organisations";
import users from "./users";
import services from "./services";
import categories from "./categories";
import cities from "./cities";
import banners from "./banners";
import filter from "./filter";
import cars from "./cars"
import promotion from "./promotion";
import report from "./report";
import reviews from "./reviews";
import subscribe from "./subscribe";
import admin from "./admin";

import authorization from "../middlewares/validation";
import subscription from "../middlewares/subscription";

const express = require('express');

const router = express.Router();

router.use('/users', authorization, subscription, users);
router.use('/cities', authorization, subscription, cities);
router.use('/organisations', authorization, subscription, organisations);
router.use('/services', authorization, subscription, services);
router.use('/categories', authorization, subscription, categories);
router.use('/banners', authorization, subscription, banners);
router.use('/filter', authorization, subscription, filter);
router.use('/cars', authorization, subscription, cars);
router.use('/reviews', authorization, subscription, reviews)
router.use('/promotion', authorization, subscription, promotion);
router.use('/report', authorization, subscription, report)
router.use('/subscribe', authorization, subscription, subscribe)
router.use('/admin', authorization, subscription, admin)

export default router;
