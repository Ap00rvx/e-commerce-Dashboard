const express = require('express');
const router = express.Router(); 
const controlller = require("../controller/seller_controller"); 


router.post("/createSeller",controlller.createNewSeller); 
module.exports = router; 