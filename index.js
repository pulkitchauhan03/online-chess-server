require('dotenv').config();
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const port = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const authRoute = require('./routes/auth')(io);
const { authCheck } = require('./middlewares/auth');
const User = require('./models/User');

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('MongoDB connected');
});

app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use(`/api/auth`, authRoute);

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});