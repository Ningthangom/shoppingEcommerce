
    const ErrorHandler = require('../utils/errorHandler');


    module.exports = (err, req, res, next) => {
        // if statusCode does not exist, the defeault will be 500 error which is internal err
        err.statusCode = err.statusCode || 500;
        err.message = err.message || 'internal Server Error';


            res.status(err.statusCode).json({
                success: false,
                error: err.stack 
            })
    }