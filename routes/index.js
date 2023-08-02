const express = require('express');
import users from "./users";
import authorization from "../middlewares/validation";

const router = express.Router();

router.use('/users', authorization, users);

export default router;
