const express = require('express');
const router = express.Router(); 
const controlller = require("../controller/product_controller"); 
const sellerMiddleware = require("../middleware/seller_middleware");


router.get("/category/:category",controlller.getProductByCategory); 
router.get("/",controlller.searchProduct); 
router.post("/createProduct",sellerMiddleware,controlller.createProduct); 


module.exports = router; 