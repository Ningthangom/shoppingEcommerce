

    const express = require("express");
    const app = express();

    const cookieParser = require('cookie-parser');

    const errorMiddleware = require("./middlewares/error")

    app.use(express.json());
    app.use(cookieParser());

    // import all routes
    const products = require('./routes/product')

    // import auth routes
    const auth = require('./routes/auth');


    app.use('/api/v1',products);
    app.use('/api/v1',auth);

    // middleware to handle errors
    app.use(errorMiddleware);
    module.exports = app;
