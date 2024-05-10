const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); 
const User = require("../model/user_model"); 
const UserModel = require('../model/user_model');
const sendMail = require('../helper/node_mailer');
const otpGenerator = require("otp-generator"); 
const OTP = require("../model/otp_model")
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
                console.log("user data saved"); 
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
}
module.exports = UserController; 