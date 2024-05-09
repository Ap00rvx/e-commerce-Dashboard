const mongoose = require('mongoose');
const connectdb = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS ={
            dbName :"e-commerce",
            
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS); 
        console.log("Database Connected to mongo");
    }catch(err){
        console.log(err); 
    }
}
module.exports = connectdb ;