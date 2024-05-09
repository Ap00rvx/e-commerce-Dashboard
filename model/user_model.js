const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required :true,
        unique:true
    },
    name:{
        type:String,
    },
    email :{
        type :String, 
        unique:true,
        required:true,
    },
    password:{
        type :String
    },
    phone:{
        type :Number,
        length:10, 
        required :true,

    },
    isVerified :{
        type :Boolean,
        default :false,
    },
    userID:{
        type:String,
        default: function() {
            return  this._id ;
        }
    },
    address:{
        type :String,
        default:"not-provided"
    },
    role:{
        type: String,
        enum : ['buyer','seller'],
        default :'buyer',
    },
    cart:{
        type:Array,
        default : []
    },
    orders:{
        type:Array,
        default :[]
    }
}); 
const UserModel = mongoose.model("user",UserSchema); 
module.exports = UserModel;