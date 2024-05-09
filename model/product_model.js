const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    title:{
        type:String, 
        required :true
    },
    userID:{
        type:String,
        required:true
    },
    productID :{
        type:String,
        default: function() {
            return  this._id ;
        }
    },
    description:{
        type:String,
        required :true
    },
    price:{
        type:Number,
        required :true,
    },
    images :{
        type:Array,
        default :[]
    },
    review:{
        type:Array,
        default :[]
    },
    rating:{
        type :Number,
        default:0.0
    },
    category:{
        type:String,
        default:"unknown"
    }
}); 
const ProductModel =  mongoose.model("product",ProductSchema); 
module.exports = ProductModel ; 

