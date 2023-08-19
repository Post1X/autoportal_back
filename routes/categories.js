import CategoriesController from "../controller/CategoriesController";

const express = require('express');

const router = express.Router();

router.post('/', CategoriesController.CreateCategory);
router.get('/', CategoriesController.GetCategories)

export default router;
