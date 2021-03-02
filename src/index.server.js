require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

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

app.use(express.json());
app.use("/api/user", require("./routes/auth"));
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/category", require("./routes/category"));

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
