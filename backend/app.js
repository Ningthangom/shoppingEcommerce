

    const express = require("express");
    const app = express();
    const cookieParser = require('cookie-parser');
    const fileUpload = require('express-fileupload');


    const errorMiddleware = require("./middlewares/error")

    app.use(express.json());
    app.use(express.urlencoded({extend: true}));
    app.use(cookieParser());
    app.use(fileUpload());


    // import all routes
    const products = require('./routes/product')
    

    // import auth routes
    const auth = require('./routes/auth');

    //import oder routes
    const order = require('./routes/order')


    app.use('/api/v1',products);
    app.use('/api/v1',auth);
    app.use('/api/v1/',order);


    // middleware to handle errors
    app.use(errorMiddleware);
    module.exports = app;
