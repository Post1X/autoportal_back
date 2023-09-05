import OrganisationsController from "../controller/OrganisationsController";
import upload from "../utilities/multer";
import FavoritesController from "../controller/FavoritesController";

const express = require('express');
const uploadFields = upload.any();

const router = express.Router();

router.post('/my', uploadFields, OrganisationsController.CreateOrganisation);
router.get('/my', uploadFields, OrganisationsController.GetOrganisation);
router.post('/', OrganisationsController.FilterOrganisation);
router.get('/', OrganisationsController.GetSingleOrganisation);
router.get('/favorites', FavoritesController.GetOrganisations);
router.get('/promotions')

export default router;
