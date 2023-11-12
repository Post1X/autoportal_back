import ServicesController from "../controller/ServicesController";

const express = require('express');

const router = express.Router();

router.post('/', ServicesController.CreateService);
router.get('/', ServicesController.GetServices);
router.post('/search', ServicesController.searchServices);
router.post('/ext', ServicesController.CreateExtService);
router.get('/ext', ServicesController.getExtServices);
router.delete('/', ServicesController.deleteSerivce);
router.put('/', ServicesController.updateService);


export default router;
