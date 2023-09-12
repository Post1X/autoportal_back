const express = require('express');
import ClientsController from "../controller/ClientsController";
import DealersController from "../controller/DealersController";
import upload from "../utilities/multer";
const uploadFields = upload.any()

const router = express.Router();

router.get('/profile/client', ClientsController.GetProfile);
router.post('/register/client', ClientsController.RegisterClient);
router.post('/login/client', ClientsController.LoginClient);
router.post('/login/client/make-call', ClientsController.RegisterClient)
router.post('/login/client/confirm', ClientsController.confirmNumber)
router.post('/login/guest', ClientsController.loginAsGuest)

// dealer

router.get('/profile/dealer', DealersController.GetProfile);
router.post('/register/dealer', DealersController.RegisterDealer);
router.post('/login/dealer', uploadFields, DealersController.LoginDealer);
router.post('/login/dealer/make-call', DealersController.registerViaPhone)
router.post('/login/dealer/confirm', DealersController.confirmNumber)

// admin

export default router;
