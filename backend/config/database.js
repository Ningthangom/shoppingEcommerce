
    const mongoose = require('mongoose');

    const connectDatabase = () => {

        mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            dbName:'shopit',
            useUnifiedTopology: true,
            useCreateIndex: true,
        }).then (con => {
            console.log(`Mongodb connected to host: ${con.connection.host}`);
        })
    }

    module.exports = connectDatabase