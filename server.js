const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

const { mongoose } = require('./config/database')

const authRoutes = require("./routers/auth");
const messageRoutes = require("./routers/messages");

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);


const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
); 