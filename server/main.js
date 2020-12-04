import express from 'express';
import { urlencoded, json } from 'body-parser';
import path from 'path';
import cors from 'cors';

require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 12400;
let interval;
app.use(cors());
const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response);
};
app.locals.io = io;
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(urlencoded({
  extended: true,
}));
app.use(json());
app.use('/public', express.static(`${__dirname}/public`));

app.use('/api/movies', require('./routes/api/v1/rating'));
app.use('/api/settings', require('./routes/api/v1/settings'));
app.use('/api/by-age', require('./routes/api/v1/byAge'));
app.use('/api/tasks', require('./routes/api/v1/tasks'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
server.listen(PORT, () => console.log(`Home Cinema Toolkit has started on ${PORT}!`));
