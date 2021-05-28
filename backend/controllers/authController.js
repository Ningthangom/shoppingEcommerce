
    const User = require('../models/user');

    const ErrorHandler = require('../utils/errorHandler');
    const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


    // registor a user => api/v1/registered
    exports.registerUser = catchAsyncErrors (async (req, res, next) => {

        // pull the name, email and password from req.body
        const {name, email, password} = req.body;

        const user = await User.create({
            name,
             email,
              password,
              avator: {
                  public_id: 'products/chairmount_nuubea',
                  url: 'https://res.cloudinary.com/bookit/image/upload/v1606231285/products/chairmount_nuubea.jpg'
              }
            })

            const token = user.getJwtToken();
            res.status(201).json({
                success: true,
                token
            })
    })

    // login User => /api/v1/login

    exports.loginUser = catchAsyncErrors (async (req, res, next) => {
        const {email, password} = req.body;

        // check if  email and product is entered by user 

            if(!email || !password) {
                return next(new ErrorHandler('Please Enter email & password', 400));
            };
            // finding user in database
            const user = await User.findOne({email}).select('+password')

            if(!user) {
                return next(new ErrorHandler('Invalid Email or Password', 401))
            }

            // check if the password is correct
            const isPasswordMatched = await user.comparePassword(password);

            if(!isPasswordMatched) {
                return next(new ErrorHandler('Invalid Email or Password', 401));
            }

            const token = user.getJwtToken();

            res.status(200).json({
                success: true,
                token

            })
    })