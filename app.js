const express = require('express')
const dotenv = require('dotenv');
const userRoutes = require("./routes/user_routes")
const productRoutes = require("./routes/products_routes")
const sellerRoutes = require("./routes/seller_routes")
dotenv.config();
const app = express()
const port = process.env.PORT
const db = require("./config/connectDB"); 
const ProductModel = require('./model/product_model');
app.use(express.json()); 
db(process.env.DATABASE_URL)
app.use("/api/user/",userRoutes);
app.use("/api/product/",productRoutes);
app.use("/api/seller/",sellerRoutes);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`listening on port ${port}!`))