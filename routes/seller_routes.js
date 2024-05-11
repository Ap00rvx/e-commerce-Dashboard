const express = require('express');
const router = express.Router(); 
const controlller = require("../controller/seller_controller"); 
const sellerMiddleware = require("../middleware/seller_middleware");

router.post("/createSeller",controlller.createNewSeller); 
module.exports = router; 