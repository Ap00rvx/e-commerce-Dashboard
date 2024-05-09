const mongoose = require('mongoose');
const Product = require("../model/product_model");
const ProductModel = require('../model/product_model');
const UserModel = require('../model/user_model');
const SellerModel  = require("../model/seller_model"); 

class SellerController {
    static createNewSeller = async(req,res) => {
        try{
            const {userID,name,pickupAddress,phone} = req.body; 
            if(userID && name && pickupAddress && phone){
                const checkUser = await SellerModel.findOne({userID:userID}); 
                if(checkUser){
                    return res.status(409).send({"status":"failed","message":"Seller Already Exist"});
                }
                else{
                    const newSeller = new SellerModel({
                        userID:userID,
                        name:name,
                        pickupAddress:pickupAddress,
                        phone:phone, 
                    }); 
                    await newSeller.save();
                    await UserModel.findByIdAndUpdate({userID:userID},{role:'seller'}); 
                    return res.status(201).send({"status":"success","message":"Seller created Successfully!"}); 
                }

        }else{
                res.status(400).send({"status":"failed","message":"All Fields are required"}) ;
            }
        }catch(err){
            res.status(500).send({"status":"failed","message":"Internal Server Error"}); 
        }
    }
}

module.exports =SellerController ; 