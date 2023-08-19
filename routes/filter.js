import CategoriesController from "../controller/CategoriesController";

const express = require('express');

const router = express.Router();

router.get('/', CategoriesController.FilterData)

export default router;
