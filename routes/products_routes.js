const express = require('express');
const router = express.Router(); 
const controlller = require("../controller/product_controller"); 


router.post("/createSeller",controlller.createProduct); 