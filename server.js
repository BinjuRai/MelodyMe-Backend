// require("dotenv").config();
// const app = require("./index");

// const PORT = process.env.PORT || 5050
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const app = require("./index");


const PORT = process.env.PORT || 5050;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

// Track connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user with their userId
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Attach Socket.IO and connectedUsers map to app
app.set("io", io);
app.set("connectedUsers", connectedUsers);

const lessonRoutes = require('./routes/admin/lessonContentRoute');
app.use('/api/admin/lesson', lessonRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


