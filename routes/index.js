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

import authorization from "../middlewares/validation";

const express = require('express');

const router = express.Router();

router.use('/users', authorization, users);
router.use('/cities', authorization, cities);
router.use('/organisations', authorization, organisations);
router.use('/services', authorization, services);
router.use('/categories', authorization, categories);
router.use('/banners', authorization, banners);
router.use('/filter', authorization, filter);
router.use('/cars', authorization, cars);
router.use('/reviews', authorization, reviews)
router.use('/promotion', authorization, promotion);
router.use('/report', authorization, report)

export default router;
