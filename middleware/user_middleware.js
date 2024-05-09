
const jsonwebtoken = require('jsonwebtoken');
const User = require('../model//user_model'); 

var checkAuthToken = async (req,res,next )=> {
    const token = req.header("x-auth-token");
 if (!token){
        res.send({"status":"failed","message":"Token not found"}); 
    }else{
        try {
            const userId = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(userId['userID']).select('-password');
            next(); 
        }catch(err){
            res.status(403).send({"status":"failed","message":"Unauthorized sender"}); 
        }
    }
    
   
}
module.exports= checkAuthToken;