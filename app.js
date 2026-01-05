const express = require('express');
const app = express();
const userRoute = require('./route/user.route')
const productRoute = require('./route/product.route')
require('./model/index')

app.use('/user', userRoute)
app.use('/product', productRoute)

module.exports = app;
