
    // create and send token and save in the cookies

    const sendToken = (user, statusCode, res) =>{

        // create Jwt token
        const token = user.getJwtToken();

        //options for cookie
        // CONVERT THE HOURS INTO MILI SECONDS
        // if httpOnly is not true, the token can be accessed with js codes 

        const options = {
            expires: new Date( 
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 *1000
            ), 
                httpOnly: true
        } 

        res.status(statusCode).cookie('token',token, options).json({
            success: true,
            token,
            user
        })

    }

    module.exports = sendToken;