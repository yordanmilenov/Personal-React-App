const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const TodoItemRoute = require("./routes/todoItems");
const app = express();
const PORT = process.env.PORT || 5500;
const dbURL  = "mongodb://127.0.0.1:27017/todo";



app.use(express.json());
app.use(cors());

mongoose
    .connect(dbURL)
    .catch((err) => console.log(err));

app.use("/", TodoItemRoute);

app.listen(PORT);


module.exports = app;