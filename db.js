const mongoose = require("mongoose");

const uri =
    "mongodb+srv://cubenbits:" +
    process.env.MONGODB_API_KEY +
    "@icluster.kiuylnu.mongodb.net/?retryWrites=true&w=majority";

const connectDB = () => {
    mongoose.connect(uri, {});
};

module.exports = connectDB;
