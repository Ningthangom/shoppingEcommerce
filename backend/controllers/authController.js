
    const User = require('../models/user');

    const ErrorHandler = require('../utils/errorHandler');
    const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
    const sendToken = require('../utils/jwtToken');
    const sendEmail = require('../utils/sendEmail')
    const crypto = require('crypto');
    const cloudinary = require('cloudinary')


    // registor a user => api/v1/registered
    exports.registerUser = catchAsyncErrors (async (req, res, next) => {

        const result = await cloudinary.v2.uploader.upload(req.body.avator, {
            folder: 'avators',
            width:150,
            crop: "scale"
        })

        // pull the name, email and password from req.body
        const {name, email, password} = req.body;

        const user = await User.create({
            name,
             email,
              password,
              avator: {
                  public_id: result.public_id,
                  url: result.secure_url
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
        const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

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

            if(req.body.password !== req.body.confirmPassword){
                return next(new ErrorHandler('Password does not match', 400))
            }

            // set up new password
            user.password = req.body.password;


            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save()
            sendToken(user, 200, res);
        })




        // get currently login user details => /api/v1/me
        exports.getUserProfile = catchAsyncErrors (async (req, res, next) => {
                const user = await User.findById(req.user.id)

                res.status(200).json({
                    success: true,
                    user
                })
        })


        // Update password => /api/v1/password/update
        exports.updatePassword = catchAsyncErrors (async (req, res, next) => {

            const user = await  User.findById(req.user.id).select('+password');
            //check previous user password
            const isMatch = await user.comparePassword(req.body.oldPassword);
            if(!isMatch){
                return next(new ErrorHandler('Old password is incorrect'))
            }
            user.password = req.body.password;
            await user.save();

            sendToken(user, 200, res);

        })

        // update user profile => /api/v1/me/update
        exports.updateProfile = catchAsyncErrors (async (req, res, next) => {

            const newUserData = {
                name: req.body.name, 
                email:req.body.email

            }
            // update avator (profile picture) : todo
            if (req.body.avator !== '') {
                const user = await User.findById(req.user.id)
        
                const image_id = user.avator.public_id;
                const res = await cloudinary.v2.uploader.destroy(image_id);
        
                const result = await cloudinary.v2.uploader.upload(req.body.avator, {
                    folder: 'avators',
                    width: 150,
                    crop: "scale"
                })
        
                newUserData.avator = {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            }

            const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            res.status(200).json({
                success: true,
                message:'profile updated successfully'
            

            })



        })


    //logout user => /api/v1/logout

    exports.logout = catchAsyncErrors(async (req, res, next) => {

        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        } )

        res.status(200).json({
            success: true,
            message: 'Logged out'
        })
    })



    //Admin routes 
    

    // get all users

    exports.getAllUsers = catchAsyncErrors (async (req, res, next) => {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        })
    })


    // get user details => /api/v1/admin/user/:id
    exports.getUserDetails = catchAsyncErrors (async (req, res, next) => {
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler(`user is not found with id:${req.params.id}`))
        }
        res.status(200).json({
            success: true,
            user
        })
    })


    
        // update user profile => /api/v1/admin/user/:id
        exports.updateUser = catchAsyncErrors (async (req, res, next) => {

            const newUserData = {
                name: req.body.name, 
                email:req.body.email,
                role:req.body.role

            }
            // update avator (profile picture) : todo

            const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            res.status(200).json({
                success: true,
                message:'profile updated successfully',
                user
            })

        })

            //delete user  => /api/v1/admin/user/:id
    exports.deleteUser = catchAsyncErrors (async (req, res, next) => {
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler(`user is not found with id:${req.params.id}`))
        }
        // remove avator from cloudinary: to do
        await user.remove();
        res.status(200).json({
            success: true,
            message: 'user deleted successfully',
            user
        })
    })
