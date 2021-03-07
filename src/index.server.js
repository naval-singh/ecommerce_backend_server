require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 2000;

// DATABASE CONFIGURATION

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rruve.mongodb.net/${process.env.DB_DBNAME}?retryWrites=true&w=majority`;
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Database connected");
    });

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use("/api/cart", require("./routes/cart"));
app.use("/api/user", require("./routes/auth"));
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/category", require("./routes/category"));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
