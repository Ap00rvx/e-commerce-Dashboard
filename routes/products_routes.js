const express = require('express');
const router = express.Router(); 
const controlller = require("../controller/product_controller"); 
const sellerMiddleware = require("../middleware/seller_middleware");

//public 
router.get("/category/:category",controlller.getProductByCategory); 
router.get("/",controlller.searchProduct);

//protected 
router.post("/createProduct",sellerMiddleware,controlller.createProduct);
router.post("/updateProduct",sellerMiddleware,controlller.updateProduct);  


module.exports = router; 