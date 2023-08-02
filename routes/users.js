const express = require('express');
import ClientsController from "../controller/ClientsController";
import DealersController from "../controller/DealersController";

const router = express.Router();

router.get('/profile/client', ClientsController.GetProfile);
router.post('/register/client', ClientsController.RegisterClient);
router.post('/login/client', ClientsController.LoginClient);
router.get('/profile/dealers', DealersController.GetProfile);
router.post('/register/dealers', DealersController.RegisterDealer);
router.post('/login/dealers', DealersController.LoginDealer);

export default router;
