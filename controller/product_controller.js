const mongoose = require('mongoose');
const Product = require("../model/product_model");
const ProductModel = require('../model/product_model');
const UserModel = require('../model/user_model');
const SellerModel  = require("../model/seller_model"); 
class ProductController {
    static  createProduct = async(req,res) => {
        try{
            const {title,description,price,category,userID,quantity} = req.body;
            if(title && description && price && userID && category && quantity){
                const newproduct = new ProductModel({
                    title:title, 
                    description:description,
                    userID:userID,
                    price:price,
                    quantity:quantity,
                    category:category
                }); 
                await newproduct.save();
                const productID = newproduct.productID;
                const seller =await SellerModel.findOne({sellerId:userID}); 
                if(seller){
                    let products = seller.products;
                    products.push(productID); 
                    const updatedSeller = await SellerModel.findByIdAndUpdate(userID,{products:products}); 
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
    static getProductByCategory = async(req,res) => {
        const category = req.params.category ; 
        console.log(category);
        try {
            const products = await ProductModel.find({category:category});
            if(!products){
                return res.send({"status":"success","products":"Category Doesn't exits "}); 
            }
            return res.status(200).send({status:"success",products:products}); 
        }catch(err){
            return res.status(500).send({"message":"Internal Server error"}); 
        }
    }
    static searchProduct = async(req,res) =>{
        const query = req.query.search; 
        try {
            const products = await ProductModel.find({ title: { $regex: query, $options: 'i' } });
            if (products.length === 0) {
                return res.status(404).json({ status: "success", message: "Product not found" }); 
            }
            return res.status(200).json({ status: "success", products: products }); 
        } catch (err) {
            console.error("Internal Server Error:", err);
            return res.status(500).json({ message: "Internal Server error" }); 
        }
        
    } 
    static updateProduct = async (req, res) => {
        const userID = req.user._id;
        if (userID) {
            const productID = req.header("product");
            const data = req.body;
            try {
                const product = await Product.findOne({ _id: productID });
                if (!product) {
                    return res.status(404).send({ status: "failed", message: "Product not found" });
                }
                const seller = await SellerModel.findOne({userID :userID}); 
                if (product.userID.toString() !== seller.sellerId.toString()) {
                    return res.status(401).send({ status: "failed", message: "Unauthorized Seller" });
                }
                // Update only specific fields
                Object.keys(data).forEach(key => {
                    if (key in product) {
                        product[key] = data[key];
                    }
                });
                await product.save();
                return res.status(200).send({ status: "success", message: "Product updated successfully", product });
            } catch (err) {
                console.error("Error updating product:", err);
                return res.status(500).send({ status: "failed", message: "Internal Server error" });
            }
        } else {
            return res.status(401).send({ status: "failed", message: "Unauthorized" });
        }
    }
    
}
module.exports = ProductController ;