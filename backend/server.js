

    const app = require("./app")

    const connectDatabase = require('./config/database')
    const cloudinary = require('cloudinary');


    const dotenv = require('dotenv');

    // handle uncaught exceptions
    process.on('uncaughtException',err =>{
        console.log(`ERROR: ${err.stack}`);
        console.log('shutting down sever due to uncaught exception');
        process.exit(1)
    })


    // setting up config file 
/* if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' }) */
    
dotenv.config({ path: 'backend/config/config.env' })
// Connecting to database
connectDatabase();

        // setting up cloudinary configs
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key        : process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
  
   const server =  app.listen(process.env.PORT, () => {
        console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
    })

    // handle unhandled promise rejection 
    process.on('unhandledRejection', err => {
        console.log(`ERROR: ${err.message}`)
        console.log('shutting down the server due to unhandled promise rejection');
        server.close(() => {
            process.exit(1)
        })
    })