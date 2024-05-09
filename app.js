const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const port = process.env.PORT
const db = require("./config/connectDB"); 
const ProductModel = require('./model/product_model');
app.use(express.json()); 
db(process.env.DATABASE_URL)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`listening on port ${port}!`))