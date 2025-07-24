const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
// const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoute');
const boardRoutes = require('./routes/boardRoute');
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
// server.js or index.js
// app.use('/api/boards', require('./routes/board'));




// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
    console.log(`User joined board: ${boardId}`);
  });

  socket.on('taskUpdated', ({ boardId, columns }) => {
    socket.to(boardId).emit('updateFromServer', columns);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});



server.listen(5000, () => console.log('Server running on port 5000'));
