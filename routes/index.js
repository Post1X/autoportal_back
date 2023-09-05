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

import authorization from "../middlewares/validation";

const express = require('express');

const router = express.Router();

router.use('/users', authorization, users);
router.use('/cities', authorization, cities);
router.use('/organisations', authorization, organisations);
router.use('/services', authorization, services);
router.use('/categories', authorization, categories);
router.use('/banners', banners);
router.use('/filter', filter);
router.use('/cars', cars);
router.use('/promotions', promotion);
router.use('/router', report)

export default router;
