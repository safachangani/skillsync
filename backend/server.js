require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
// const { Server } = require('socket.io');
const { Server } = require('socket.io')
const path = require('path');
const mongoose = require('mongoose');
const skillSyncRouter = require('./routes/skillsync');
const { Message } = require('./controller/controller');

const session = require('express-session');
const passport = require('passport');
require('./controller/passport'); // Path to your passport config

app.use(session({ secret: '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', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configure CORS options
const corsOptions = {
  // origin: ['https://skillsync-wefd.onrender.com', 'http://localhost:3000'],
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// JSON body parser middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/skillsync/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB database with the database name 'skillsync'
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'skillsync'
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Set up SkillSync router
app.use('/skillsync', skillSyncRouter);

// Set up HTTP server
const server = http.createServer(app);

// Set up Socket.IO server
// const io = new Server(server, {
//     cors: {
//         // origin: 'https://skillsync-wefd.onrender.com '
//         origin:'http://localhost:3000/',
//         methods: ['GET', 'POST']
//     }
// });

// Socket.IO event listeners
// io.on('connection', (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on('join_room', (data) => {
//         socket.join(data);
//         console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     });

//     socket.on('send_message', async (data) => {
//         console.log(data);
//         try {
//             let message = await Message.findOne({ roomId: data.room });

//             if (!message) {
//                 message = new Message({
//                     roomId: data.room,
//                     senderId: data.senderId,
//                     receiverId: data.receiverId,
//                     messages: [{
//                         content: data.message.content,
//                         senderId: data.senderId,
//                         receiverId: data.receiverId,
//                         createdAt: new Date()
//                     }]
//                 });
//             } else {
//                 message.messages.push({
//                     content: data.message.content,
//                     senderId: data.senderId,
//                     receiverId: data.receiverId,
//                     createdAt: new Date()
//                 });
//             }

//             await message.save();
//             socket.broadcast.to(data.room).emit('receive_message', { senderId: data.senderId, message: data.message });
//             console.log('Sending message to :', data.message);
//             console.log(`User with ID: ${socket.id} sent a message to room: ${data.room}`);
//         } catch (error) {
//             console.error('Error saving message:', error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log(`User Disconnected: ${socket.id}`);
//     });
// });


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const userSocketMap = {};
io.on("connection", (socket) => {
  // console.log(`User connected ${socket.id}`);

  // socket.onAny((event, ...args) => {
  //     console.log("🟡 Incoming event:", event, args);
  //   });

  // Step 1: Save userId -> socketId mapping
  socket.on("join", (userId) => {
    // console.log("this is the userrrr",userId);

    userSocketMap[userId] = socket.id;
    // console.log(`User ${userId} joined with socket ${socket.id}`);
  });
  // Step 2: Private message handling
  socket.on("private_message", async ({ recipientId, senderId, message, fileUrl, fileType, createdAt }) => {
    console.log(fileUrl, fileType, createdAt);
    
    try {
      const newMsg = new Message({
        senderId,
        receiverId: recipientId,
        content: message,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        createdAt: createdAt
      });
  
      await newMsg.save();
  
      const payload = {
        from: senderId,
        message,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        createdAt: newMsg.createdAt,
      };
  
      const receiverSocketId = userSocketMap[recipientId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", payload);
      }
  
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("receive_message", payload);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  
  socket.on("disconnect", () => {
    // console.log(`user disconnected ${socket.id}`);

  })
})

// Start the server
const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
