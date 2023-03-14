const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const TodoItemRoute = require("./routes/todoItems");
const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cors());

mongoose
    .connect("mongodb://localhost/todo")
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

app.use("/", TodoItemRoute);

app.listen(PORT, () => console.log("Server connected"));
