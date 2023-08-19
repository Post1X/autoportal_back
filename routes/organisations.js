import OrganisationsController from "../controller/OrganisationsController";
import upload from "../utilities/multer";

const express = require('express');
const uploadFields = upload.any();

const router = express.Router();

router.post('/my', uploadFields, OrganisationsController.CreateOrganisation);
router.get('/my', uploadFields, OrganisationsController.GetOrganisation);
router.post('/', OrganisationsController.FilterOrganisation);

export default router;
