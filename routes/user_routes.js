const express = require('express');
const router = express.Router();
const controller = require("../controller/user_controller");
const middleware = require("../middleware/user_middleware"); 



//public
router.post("/register",controller.register);
router.post("/login",controller.login);
router.post("/verify",controller.verifyOtp); 



//protected
router.get('/profile',middleware,controller.profile); 
router.post("/updateProfile",middleware,controller.updateProfile);
router.get("/addToCart",middleware,controller.addtoCart); 
router.get("/cart",middleware,controller.getCart); 
router.get("/remove",middleware,controller.removeFromCart); 
router.get("/changepwd",middleware,controller.changePassword); 


module.exports = router; 