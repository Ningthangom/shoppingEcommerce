
    const User = require('../models/user');

    const ErrorHandler = require('../utils/errorHandler');
    const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
    const sendToken = require('../utils/jwtToken');
    const sendEmail = require('../utils/sendEmail')
    const crypto = require('crypto');


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

         sendToken(user, 200, res );
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

            sendToken(user, 200, res );
    })
    

    // forgot password => /api/v1/password/forgot
    exports.forgotPassword = catchAsyncErrors (async (req, res, next) => {

        const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new ErrorHandler('Invalid email', 404))
        }

        // get reset token 
        const resetToken = user.getResetPasswordToken();
        await user.save({validateBeforeSave: false})

        // create reset password url 
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

        const message = `your password reset token is as follow: \n\n${resetUrl}\n\n if you have not requested this email, please ingor it`

        try {

            await sendEmail ({
                email: user.email,
                subject: 'shopit password recovery',
                message

            })
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            })

        }catch(error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave: false})

            return next(new ErrorHandler(error.message, 500))
        }
    })

        // reset password => /api/v1/password/reset/:token
        exports.resetPassword = catchAsyncErrors (async (req, res, next) => {
            // hash url token
            const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
            const user = await User.findOne({
                resetPasswordToken, 
                resetPasswordExpire: { $gt: Date.now()}
            })
            if(!user) {
                return next(new ErrorHandler('Password reset is not invalid or expired', 400))
            }

            if(req.body.password !== req.body.comfirmPassword){
                return next(new ErrorHandler('password does not match', 401))
            }

            // set up new password
            user.password = req.body.password;


            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save()
            sendToken(user, 200, res);
        })




    //logout user => /api/v1/logout

    exports.logout = catchAsyncErrors(async (req, res, next) => {

        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        } )

        res.status(200).json({
            success: true,
            message: 'Logged out '
        })
    })