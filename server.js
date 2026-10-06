require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db.js');


const PORT = process.env.PORT;
connectDB();

app.listen(PORT || process.env.PORT,  () => {
    try {
        console.log(`Server is running on port ${PORT}`)
    } catch (err) {
        console.log(`Server Error : ${err.message}`);
    };
});