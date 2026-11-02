require("dotenv").config();
const express = require("express");

const authRouter = require("./routers/authRouter");
const postsRouter = require("./routers/postsRouter");

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postsRouter);

module.exports = app;
