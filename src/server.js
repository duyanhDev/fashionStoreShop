const express = require("express");
const http = require("http");
const app = express();
const connectDB = require("./Config/db");
const RouterAPI = require("./Routes/Routes");
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const port = process.env.PORT;

const { Server } = require("socket.io");
const server = http.createServer(app);

// Cấu hình CORS cho Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(fileUpload());

// Route cơ bản
app.get("/", (req, res) => {
  res.send("Hello World 1234 !");
});

// Thêm Router API
app.use("/api/v1/", RouterAPI);
app.set("io", io);
// Kết nối Socket.IO
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Kết nối DB và khởi động server
(async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Backend zero app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>check error connection db", error);
  }
})();
