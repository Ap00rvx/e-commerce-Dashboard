const mongoose = require("mongoose"); 
const SellerSchema = new mongoose.Schema({
    products:{
        type:Array,
        default:[]
    },
    orders:{
        type:Array,
        default:[]
    },
    sellerId:{
        type:String,
        default: function() {
            return  this._id ;
        }
        
    },
    userID:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true, 
    },
    pickupAddress:{
        type:String,
        default:"",
        required :true,
    },
    phone:{
        type:Number,
        required:true
    }
}); 
const SellerModel = mongoose.model("seller",SellerSchema); 
module.exports = SellerModel; 