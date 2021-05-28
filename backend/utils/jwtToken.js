
    // create and send token and save in the cookies

    const sendToken = (user, statusCode, res) =>{

        // create Jwt token
        const token = user.getJwtToken();

        //options for cookie
        // CONVERT THE HOURS INTO MILI SECONDS
        // httpOnly is not true, the token can be accessed with js codes 

        const options = {
            expire: new Date( 
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60*1000
            ), 
                httpOnly: true
        }

    }

    module.exports = sendToken;