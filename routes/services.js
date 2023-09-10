import ServicesController from "../controller/ServicesController";

const express = require('express');

const router = express.Router();

router.post('/', ServicesController.CreateService);
router.get('/', ServicesController.GetServices);
router.post('/ext', ServicesController.CreateExtService);

export default router;