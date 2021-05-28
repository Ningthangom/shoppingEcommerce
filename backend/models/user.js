
    const mongoose = require('mongoose');
    const validator =require('validator');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    const userSchema = new mongoose.Schema({

        name: {
            type: String,
            required: [true,'please enter your name'],
            maxLength:[30, 'your name cannot exceed 30 characters']
        },
        // unique will make sure that there is no two same email in the userschema
        email: {
            type: String,
            required: [true,'please enter your email'],
            unique: true,
            validate: [validator.isEmail, 'please enter a valid email']
        },
        // false will make sure that the password is not displayed
        password: {
            type: String,
            required: [true,'please enter your password'],
            minLength: [6, 'your password must be at least 6 characters'],
            select: false,
        },
        // profile image
        avator:{
            public_id: {
                type: String,
                required:true
            },
            url:{
                type: String,
                required: true
            }
        },
        role: {
            type: String,
            default: 'user'

        },
        createdAt: {
            type:Date,
            default: Date.now
        },
        //restting the password
        resetPasswordToken: String,
        resetPasswordExpire:Date

    })


    // Encrypting password before saving changes
    userSchema.pre('save', async function(next) {
        if (!this.isModified('password')){
            next()
        }
        this.password = await bcrypt.hash(this.password, 10)
    })

    // compare user password
      // compare is one of bcrypt methods
    userSchema.methods.comparePassword = async function(enteredPassword) {
      
        return await bcrypt.compare(enteredPassword,this.password)
    }

    //  Return JWT token
    userSchema.methods.getJwtToken = function() {
        //STORING ID AS PAYLOAD IN THE TOKEN
        //AND PASS JWT SECRET THEN EXPIRE THE TOKEN 
        return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })
    }

    module.exports = mongoose.model('User',userSchema)