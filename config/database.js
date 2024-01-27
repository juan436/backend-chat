const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

module.exports = mongoose;

