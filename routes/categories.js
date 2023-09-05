import CategoriesController from "../controller/CategoriesController";

const express = require('express');
import upload from "../utilities/multer";
const uploadFields = upload.any();
const router = express.Router();

router.post('/', uploadFields, CategoriesController.CreateCategory);
router.get('/', CategoriesController.GetCategories)

export default router;
