const express = require('express');

const router = express.Router();
import CitiesController from "../controller/CitiesController";

router.get('/', CitiesController.FindCity);
router.get('/radius', CitiesController.FindRadius);
export default router;
