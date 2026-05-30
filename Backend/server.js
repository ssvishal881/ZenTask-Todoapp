const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

// CONNECT DB
connectDB();

// STATIC FOLDER
app.use("/uploads", express.static("uploads"));

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // FIX: was hardcoded "http://localhost:5173"
    credentials: true,
  },
});

// MAKE io AVAILABLE IN CONTROLLERS
app.set("io", io);

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// FIX: Use PORT from environment — hosting platforms assign their own port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
