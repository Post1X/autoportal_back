import CarsController from "../controller/CarsController";

const express = require('express');

const router = express.Router();

router.post('/', CarsController.CreateModel);
router.get('/', CarsController.GetCars)

export default router;
