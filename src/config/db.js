const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database is Connected successfully!`);
    } catch (err) {
        console.error(`Database Error : ${err.message}`);
    };
};

module.exports = connectDB;