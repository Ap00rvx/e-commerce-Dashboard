const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); 
const User = require("../model/user_model"); 
const UserModel = require('../model/user_model');
const sendMail = require('../helper/node_mailer');
const otpGenerator = require("otp-generator"); 
const OTP = require("../model/otp_model")
const Product = require("../model/product_model")
class UserController{
    static register = async (req,res) => {
        try {
            const{username,name,phone,password,email} = req.body; 
            if(username && name && phone && password && email ){
                const salt = await bcrypt.genSalt(10);  
                const hashedPassword = await bcrypt.hash(password,salt); 
                const checkUser = await User.findOne({email:email}); 
                if(checkUser){
                    return res.status(409).send({"status":"failed","message":"User Already Exist"}); 
                }
                const user  = new User({
                    username:username,
                    name:name,
                    phone:phone,
                    password:hashedPassword,
                    email:email, 
                }); 
                await user.save(); 
                // console.log("user data saved"); 
                const saved_user =await User.findOne({email:email});
                const token = jwt.sign({userID:saved_user._id},process.env.SECRET_KEY,{expiresIn : '150d'});
                const newOtp  = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false,digits:true});
                const otpmodel = new OTP({
                    email:email,
                    otp:newOtp,
                });
                await sendMail(email,newOtp,name);     
                await otpmodel.save(); 
                      
                res.status(201).send({"status":"success", "message":"User created successfully","user":saved_user,"token":token}); 
            }else{
                res.send({"status":"failed","message":"All fields are required"}); 
            }
           

        }catch(err){
            console.log(err);
            res.status(500).send({"status":"failed","message":"Internal Server Error"});
        }
    }
    static login = async(req,res) => {
        const {email,password}=req.body ; 
        try {
            if(email && password){
                const user = await  UserModel.findOne({email:email}); 
                if(user){
                    const isMatch = await bcrypt.compare(password,user.password); 
                    if(isMatch){
                        const token = await jwt.sign({userID:user.userID},process.env.SECRET_KEY,{expiresIn :"150d"}); 
                        res.send({ "status": "success", "message": "Login Success","token":token});
                    }else{
                        return res.send({"status":"failed","message":"InValid Password"});
                    }
                }
                else{
                    res.status(404).send({"status":"failed","message":"User not found"});
                }
            }else{
                res.send({"status":"failed","message":"All Fields are required"});
            }
        }catch(err){
            res.status(500).send({"status":"failed","message":"Internal Server Error"});
        }
    }
    static profile = async(req,res) => {
        const userID = req.user._id; 
        if(userID){
           const user = await User.findById(userID).select("-password ");
            if(user){
               res.send({'status':"success","user":user}); 
            }else{
                res.status(404).send({"status":"failed","message":"User not found"});
            }
        }
        else{
            return res.status(401).send({"status":"failed","message":"Unauthorized"});
        }
    }
    static verifyOtp = async(req,res) => {
        const {email,otp} = req.body; 
        if(!email && !otp){
            return res.send({status:"failed","message":"All fields are required"}); 
        }
        else{
        try{
            const secureOtp = await OTP.findOneAndDelete({email:email});
            if(secureOtp){
                if(otp === secureOtp.otp){
                    const user = await User.findOneAndUpdate({ email: email }, { isVerified: true });
                    return res.status(200).json({ message: "OTP Verified" });
                }
                else{
                    res.send({status:"failed",message :"Wrong Otp"}); 
                }
            }else{
                const newOtp  = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false,digits:true});
                const otpmodel = new OTP({
                    email:email,
                    otp:newOtp,
                });
                await sendMail(email,newOtp,"");     
                await otpmodel.save(); 
                res.status(400).send({"status":"failed","message":"OTP expired, New otp has been sent"}); 
            }
        }catch (err){
            res.status(500).send({message:"Internal server error "}); 
        }
    }
    }
    static updateProfile = async (req, res) => {
        const data = req.body;
        console.log(data); // Log the data object
    
        const userID = req.user._id;
        if (!userID) {
            return res.status(404).json({ status: "failed", message: "User Id not found" });
        }
    
        try {
            const user = await User.findByIdAndUpdate(userID, data, { new: true });
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found" });
            }
            res.json({ status: "success", message: "Profile updated", user });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ status: "error", message: "Internal server error" });
        }
    }
    static addtoCart = async(req,res) => {
        try {
            const productID = req.header("product");
            const userID = req.user._id; 
            if(userID && productID){
                const  user = await User.findOne({userID:userID}); 
                if (user){
                    let cartItems = user.cart ; 
                    cartItems.push(productID); 
                    await user.updateOne({cart:cartItems});
                    return res.send({status:"failed","message":"Added to cart"}); 
                }else{
                    return res.status(404).send({status:"failed",message:"user not found"}); 
                }
            } else{
                res.status(402).send({"status":"failed",message:"All fields are required"});
            }
        }catch(err){
            console.log(err);
            res.status(500).send({"message":"Internal Server Error"}); 
        }
        
    }
    static getCart = async(req,res) => {
        try {
        const userID = req.user._id; 
        if(!userID){
            return res.status(401).send({"status":'failed',"message":"not authorized"});
        }
        else{
            const user = await  User.findOne({userID:userID}); 
            let cart = []; 
            const cartItems = user.cart;
            for(let index in cartItems){
                const product = await Product.findOne({productID:cartItems[index]});
                if(product)
                    {
                        cart.push(product); 
                    } 
            }
            return res.send({status:"success",cart: cart}); 
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({status:"failed",message:"Internal Server error"});
    }
    }
    static removeFromCart = async (req, res) => {
        try {
            const userID = req.user._id;
            const productID = req.header("product");
            if (!userID) {
                return res.status(401).send({ status: 'failed', message: "Not authorized" });
            } else {
                // Find the user by userID
                const user = await User.findOne({ _id: userID });
                if (!user) {
                    return res.status(404).send({ status: 'failed', message: "User not found" });
                }
    
                // Remove the productID from the cartItems array
                user.cart = user.cart.filter(itemId => itemId.toString() !== productID);
    
                // Save the updated user document
                await user.save();
    
                return res.status(200).send({ status: "success", message: "Product removed from cart" });
            }
        } catch (err) {
            console.error("Error removing product from cart:", err);
            return res.status(500).send({ status: "failed", message: "Internal Server error" });
        }
    }
    
}
module.exports = UserController; 