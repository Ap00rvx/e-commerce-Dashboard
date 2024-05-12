const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    user : {
        type:mongoose.Types.ObjectId,
        required:true,
    },
    product : {
        type  : mongoose.Types.ObjectId,
        required:true,
    },
    seller : {
        type  : mongoose.Types.ObjectId,
        required:true,
    },
    quantity : {
        type :Number, 
        required :true, 
    },
    createdAt:
    {
        type:Date,
        default :Date.now()
    }

}); 

const Order = mongoose.model("orders",OrderSchema);


module.exports = Order ;