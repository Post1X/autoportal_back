import ReportsController from "../controller/ReportsController";

const express = require('express');

const router = express.Router();

router.post('/', ReportsController.createReport)
router.post('/')

export default router;
