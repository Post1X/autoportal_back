import OrganisationsController from "../controller/OrganisationsController";
import upload from "../utilities/multer";
import FavoritesController from "../controller/FavoritesController";
import SubscriptionController from "../controller/SubscriptionController";
import is_banned from "../middlewares/is_banned";

const express = require('express');
const uploadFields = upload.any();

const router = express.Router();

router.post('/my', is_banned, uploadFields, OrganisationsController.CreateOrganisation);
router.get('/my', uploadFields, OrganisationsController.GetOrganisation);
router.post('/', OrganisationsController.FilterOrganisation);
router.delete('/my', OrganisationsController.DeleteOrganisation);
router.put('/', is_banned, OrganisationsController.UpdateOrganisation);
router.post('/photo', uploadFields, OrganisationsController.uploadImage);
router.delete('/photo', OrganisationsController.deletePhotos)
router.get('/', OrganisationsController.GetSingleOrganisation);
router.get('/favorites', FavoritesController.GetOrganisations);
router.post('/favorites', FavoritesController.AddOrganisationToFav);
router.delete('/favorites', FavoritesController.DeleteFavOrganisation);
router.get('/favorites/all', FavoritesController.getAllFavorites);
router.get('/my/created', OrganisationsController.isCreated)
router.post('/sub-check', SubscriptionController.checkSubForOrg);


export default router;
