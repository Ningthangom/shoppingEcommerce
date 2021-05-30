
    const catchAsyncErrors = require('./catchAsyncErrors')
    const ErrorHandler = require('../utils/errorHandler')
    const jwt = require('jsonwebtoken');
    const User = require('../models/user')
    // check if user is authenticated or not authenticated
     exports.isAuthenticatedUser = catchAsyncErrors (async (req, res, next) => {

        // authenticating user in the backend instead of front end which is more secure

        const {token} = req.cookies
        
        if (!token) {
            return next(new ErrorHandler('login first to access this resource', 401));
        }

        // check if the token is correct
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next()
     })

     // handling user authorizeRoles
      
     exports.authorizeRoles = (...roles) =>{
         return(req,res, next) => {
             if(!roles.includes(req.user.role)){
                 return next(
                 new ErrorHandler(`role (${req.user.role}) is not allow to access the resource`, 403)
                 )}
             next()
         }
     }