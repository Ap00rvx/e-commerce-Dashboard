const express = require('express');
const router = express.Router();
const controller = require("../controller/user_controller");
const middleware = require("../middleware/user_middleware"); 

router.post("/register",controller.register);
router.post("/login",controller.login);
router.post("/verify",controller.verifyOtp); 

router.get('/profile',middleware,controller.profile); 
router.post("/updateProfile",middleware,controller.updateProfile);
module.exports = router; 