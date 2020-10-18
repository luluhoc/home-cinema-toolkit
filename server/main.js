import express from 'express';
import { urlencoded, json } from 'body-parser';
import path from 'path';

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 12400;

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

app.listen(PORT, () => console.log(`Home Cinema Toolkit has started on ${PORT}!`));
