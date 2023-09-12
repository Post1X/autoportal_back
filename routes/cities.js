const express = require('express');

const router = express.Router();
import CitiesController from "../controller/CitiesController";

router.post('/', CitiesController.findCity);
export default router;
