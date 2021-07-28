

    const express = require("express");
    const app = express();
    const cookieParser = require('cookie-parser');
    const fileUpload = require('express-fileupload');
    const dotenv = require('dotenv');
    const path = require('path');


    const errorMiddleware = require("./middlewares/error")

  // setting up config file 
  if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })
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

    if(process.env.NODE_ENV === 'PRODUCTION'){
        app.use(express.static(path.join(__dirname, '../frontend/build')))
        app.get('*', (req, res) => {
            req.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
        })
    }


    // middleware to handle errors
    app.use(errorMiddleware);
    module.exports = app;
