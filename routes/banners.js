import upload from "../utilities/multer";

const express = require('express');

const router = express.Router();
const uploadFields = upload.any();

import BannersController from "../controller/BannersController";

router.get('/', BannersController.GetBanners);
router.post('/', BannersController.CreateBanner);
router.put('/', BannersController.updateBanner);
router.delete('/', BannersController.deleteBanner);
export default router;
