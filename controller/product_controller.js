const mongoose = require('mongoose');
const Product = require("../model/product_model");
const ProductModel = require('../model/product_model');
const UserModel = require('../model/user_model');
const SellerModel  = require("../model/seller_model"); 
class ProductController {
    static  createProduct = async(req,res) => {
        try{
           
            const {title,description,price,category,userID} = req.body;
            if(title && description && price && userID && category){
                const newproduct = new ProductModel({
                    title:title, 
                    description:description,
                    userID:userID,
                    category:category
                }); 
                await newproduct.save();
                const productID = newproduct.productID;
                const seller =await SellerModel.findOne({sellerId :userID}); 
                if(seller){
                    let products = seller.products;
                    products.push(productID); 
                    const updatedSeller = await SellerModel.findByIdAndUpdate({sellerId:userID},{products:products}); 
                    res.status(201).send({"status":"success","message":"Product Created"});  
                }
                else{
                    res.status(404).send({"status":"failed","message":"Seller not Found "}); 
                }
            }
            else{
                res.status(400).send({"status":"failed","message":"All fields are required"}); 
            } 
            
        }catch(err){
            console.log(err);
            res.status(500).send({"status":"failed","message":"Internal Server Error"}); 
        }
    }
}
module.exports = ProductController ;