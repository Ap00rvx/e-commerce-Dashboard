const express = require('express')
const dotenv = require('dotenv');
const userRoutes = require("./routes/user_routes")
const productRoutes = require("./routes/products_routes")
const sellerRoutes = require("./routes/seller_routes")
const db = require("./config/connectDB"); 
const ProductModel = require('./model/product_model');


dotenv.config();
const app = express()
const port = process.env.PORT
db(process.env.DATABASE_URL);



app.use(express.json()); 
app.use("/api/user/",userRoutes);
app.use("/api/product/",productRoutes);
app.use("/api/seller/",sellerRoutes);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`listening on port ${port}!`))