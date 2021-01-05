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
app.use(cors());
app.locals.io = io;
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
app.use('/api/lib', require('./routes/api/v1/lib'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
server.listen(PORT, () => console.log(`Home Cinema Toolkit has started on ${PORT}!`));
