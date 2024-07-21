import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import http from 'http';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

//mongoose.connect('mongodb://localhost:27017/ChatApp', {
mongoose.connect('mongodb+srv://Kamran:1234@chatapp.0ycuhov.mongodb.net/?retryWrites=true&w=majority&appName=ChatApp',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/', userRoutes);
app.use('/api/', friendRoutes);
app.use('/api/', messageRoutes);

app.use(express.static(path.join(__dirname, 'Frontend')));

// Catch-all route to serve React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User added: ${userId}, Socket ID: ${socket.id}`);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.message);
      console.log(`Message sent from ${data.from} to ${data.to}: ${data.message}`);
    }
  });

  socket.on('offer', (data) => {
    const sendUserSocket = onlineUsers.get(data.receiverId);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('offer', data.offer, data.senderId, data.receiverId);
      console.log(`Offer sent from ${data.senderId} to ${data.receiverId}`);
    }
  });

  socket.on('answer', (data) => {
    console.log(data.senderId);
    const sendUserSocket = onlineUsers.get(data.receiverId);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('answer', data);
      console.log(`Answer sent from ${data.receiverId} to ${data.senderId}`);
    }
  });

  socket.on('ice-candidate', ({ candidate, receiverId, senderId }) => {
    console.log("Received ICE candidate event");
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('ice-candidate', { candidate });
      console.log(`ICE candidate sent from ${senderId} to ${receiverId}`);
    }
  });

  socket.on('disconnect', () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`User disconnected: ${key}`);
        break;
      }
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
