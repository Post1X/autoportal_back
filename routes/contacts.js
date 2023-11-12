import AdminController from "../controller/AdminController";

const express = require('express');

const router = express.Router();

router.get('/', AdminController.getContacts);
export default router;
