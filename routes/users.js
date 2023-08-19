const express = require('express');
import ClientsController from "../controller/ClientsController";
import DealersController from "../controller/DealersController";

const router = express.Router();

router.get('/profile/client', ClientsController.GetProfile);
router.post('/register/client', ClientsController.RegisterClient);
router.post('/login/client', ClientsController.LoginClient);

// dealer

router.get('/profile/dealer', DealersController.GetProfile);
router.post('/register/dealer', DealersController.RegisterDealer);
router.post('/login/dealer', DealersController.LoginDealer);

// admin

export default router;
