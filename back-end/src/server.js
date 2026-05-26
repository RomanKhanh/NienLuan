const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const apiRouter = require("./routes/api");
const connection = require("./config/database");

const app = express();
const port = process.env.PORT || 8888;

// config cors
app.use(cors());

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

// Tạo HTTP server + Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Gắn io vào app để dùng trong controllers/services
app.set("io", io);

io.on("connection", (socket) => {
  // Mỗi user join vào room riêng theo userId
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  socket.on("disconnect", () => {});
});

(async () => {
  try {
    await connection();
    httpServer.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
