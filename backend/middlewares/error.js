
    const ErrorHandler = require('../utils/errorHandler');


    module.exports = (err, req, res, next) => {
        // if statusCode does not exist, the defeault will be 500 error which is internal err
        err.statusCode = err.statusCode || 500;
       /*  err.message = err.message || 'internal Server Error'; */
        
       // handling error in dev mode 
       if (process.env.NODE_ENV === 'DEVELOPMENT'){
           res.status(err.statusCode).json({
               success:false,
               error:err,
               errMessage:err.message,
               stack: err.stack
           })
       }
       // handling error in prod mode
       if (process.env.NODE_ENV === 'PRODUCTION'){
           // copy the error 
           let error = {...err}
           
           error.message = err.message;

           // wrong mongoose object id error
           if(err.name === 'CastError'){
               const message = `Resource not found. Invalid: ${err.path}`
               error = new ErrorHandler(message, 400)
           }

           // handling mongoose validation error 
           if(err.name === 'validationError'){
               const message = Object.values(err.errors).map(value => value.message);
               error = new ErrorHandler(message, 400)
           }

           //handling mongoose duplicate keys error
           if(err.code === 11000) {
               const message = `Duplicate ${Object.keys(err.keyValue)} entered`
               error = new ErrorHandler(message, 400)
           }

           // handling wrong JWT error
           if(err.name === 'JsonWebtokenError'){
            const message = `JSON web token is invalid. Try again later`;
            error = new ErrorHandler(message, 400)
        }
        if(err.name === 'TokenExpiredError'){
            const message = `JSON web token is expired. Try again later`;
            error = new ErrorHandler(message, 400)
        }

           res.status(error.statusCode).json({
            success: false,
            message: error.message || 'internal Server Error'
        })
       }
         
    }