
const jsonwebtoken = require('jsonwebtoken');
const User = require('../model//user_model'); 
const Seller  = require("../model/seller_model"); 


const checkSeller = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Token not found" });
    } else {
        try {
            const userId = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(userId.userID).select('-password');
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found" });
            }
            if (user.role === "seller") {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ status: "failed", message: "You are not authorized" });
            }
        } catch (err) {
            console.error("Error verifying token:", err);
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    }
}

module.exports = checkSeller; 