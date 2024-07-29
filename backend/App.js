require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./Routes/Userrouter'); 
const adminRoutes = require('./Routes/Adminrouter'); 
const googleAuthRoutes = require('./Routes/GoogleAuthRoutes'); 
const messageRoutes = require('./Routes/messages'); 
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

mongoose.connect(process.env.MONGOOSE_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', googleAuthRoutes);
app.use('/', messageRoutes); 

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('private message', async ({ senderId, receiverId, message }) => {
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      messageType: 'text'
    });

    try {
      await newMessage.save();
      io.to(receiverId).emit('private message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
