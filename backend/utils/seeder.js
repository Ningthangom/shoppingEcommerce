
    const Product = require('../models/product');

    const dotenv = require ('dotenv');

    const connectDatabase = require('../config/database');

   // products that need to be pushed 
    const products = require('../data/products');

    // setting dotenv file path

    dotenv.config({ path: 'backend/config/config.env'});

    connectDatabase();

    const seedProducts = async () => {
        try {
            // delete the data first and enter new data 
            await Product.deleteMany();
            console.log("products are deleted")

            await Product.insertMany(products);
            console.log("all products are added")

            process.exit();

        }catch(err) {
            console.log(err.message);
            process.exit();
        }
    }

    seedProducts();