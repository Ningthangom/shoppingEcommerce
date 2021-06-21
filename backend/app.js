

    const express = require("express");
    const app = express();
    const cookieParser = require('cookie-parser');
    const fileUpload = require('express-fileupload');
    const dotenv = require('dotenv');


    const errorMiddleware = require("./middlewares/error")

    dotenv.config({path: "backend/config/config.env"})

    app.use(express.json());
    app.use(express.urlencoded({extend: true}));
    app.use(cookieParser());
    app.use(fileUpload());


    // import all routes
    const products = require('./routes/product')
    

    // import auth routes
    const auth = require('./routes/auth');

    //import order routes
    const order = require('./routes/order')

    // payment route
    const payment = require('./routes/payment')


    app.use('/api/v1',products);
    app.use('/api/v1',auth);
    app.use('/api/v1/',order);
    app.use('/api/v1/',payment);


    // middleware to handle errors
    app.use(errorMiddleware);
    module.exports = app;
