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

import sub from "../middlewares/sub";
import authorization from "../middlewares/validation";

const express = require('express');

const router = express.Router();

router.use('/users', authorization, sub, users);
router.use('/cities', authorization,  sub, cities);
router.use('/organisations', authorization,  sub, organisations);
router.use('/services', authorization,  sub, services);
router.use('/categories', authorization,  sub, categories);
router.use('/banners', authorization,  sub, banners);
router.use('/filter', authorization,  sub, filter);
router.use('/cars', authorization,  sub, cars);
router.use('/reviews', authorization,  sub, reviews)
router.use('/promotion', authorization,  sub, promotion);
router.use('/report', authorization,  sub, report)
router.use('/subscribe', authorization,  sub, subscribe)
router.use('/admin', authorization,  sub, admin)

export default router;
