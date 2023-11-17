import upload from "../utilities/multer";

const express = require('express');

const router = express.Router();
import AdminController from "../controller/AdminController";
import CategoriesController from "../controller/CategoriesController";
import ServicesController from "../controller/ServicesController";

router.post('/login', AdminController.AdminLogin);
router.get('/users', AdminController.getUsers);
router.put('/ban', AdminController.banUser);
router.get('/organisations', AdminController.getOrganisations);
router.post('/organisations/users', AdminController.getUsersOrg);
router.get('/services', AdminController.getCategories);
router.post('/sub', AdminController.createSub);
router.post('/upload', upload.any(), AdminController.uploadFile)
router.get('/policy', AdminController.getPolicy);
router.get('/offer', AdminController.getOferta);

export default router;
