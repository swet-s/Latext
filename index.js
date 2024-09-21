require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Available Routes
app.use("/", require("./routes/resume"));
app.use("/text", require("./routes/text"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is running on port 3000");
});
