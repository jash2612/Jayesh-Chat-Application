const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const User = require("./models/User");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", async ({ userId, username }) => {
    socket.join("chat");
    socket.broadcast.to("chat").emit("userJoined", { userId, username });

    const users = await User.find();
    io.to("chat").emit("updateUsers", users);
  });

  socket.on("message", async ({ text, userId, username }) => {
    const message = {
      text,
      createdAt: new Date(),
      sender: { _id: userId, username },
    };
    await new (require("./models/Message"))({ text, sender: userId }).save();
    io.to("chat").emit("message", message);
  });

  socket.on("leaveRoom", async ({ userId }) => {
    socket.leave("chat");
    socket.broadcast.to("chat").emit("userLeft", { userId });

    const users = await User.find();
    io.to("chat").emit("updateUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
