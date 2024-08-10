// Server-Side (Node.js) Code
const { Message} = require('./controller/controller');
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const skillSyncRouter = require('./routes/skillsync');

// Configure CORS options
const corsOptions = {
    origin: ['https://skillsync-wefd.onrender.com', 'http://localhost:3001'],
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

// Connect to MongoDB database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Set up SkillSync router
app.use('/skillsync', skillSyncRouter);

// Set up HTTP server
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
app.use(cors());

// Socket.IO event listeners
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
   
    });

    socket.on('send_message', async(data) => {
        // Emit the message with sender and receiver IDs
        console.log(data);
        try {
            // Check if a document with the room ID exists
            let message = await Message.findOne({ roomId: data.room });

            if (!message) {
                // If no document exists, create a new one
                message = new Message({
                    roomId: data.room, // Use the room ID as the message ID
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    messages: [{
                        content: data.message.content,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        createdAt: new Date()
                    }]
                });
            } else {
                // If a document exists, push the new message into the messages array
                message.messages.push({
                    content: data.message.content,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    createdAt: new Date()
                });
            }

            await message.save();
        
        socket.broadcast.to(data.room).emit('receive_message',{ senderId: data.senderId, message: data.message });
        console.log('Sending message to :', data.message);
        console.log(`User with ID: ${socket.id} sent a message to room: ${data.room}`);
    } catch(error){
        console.error('Error saving message:', error);
    }
  });
    
    
    
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
       
    });
});


// Start the server
const PORT =9000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
