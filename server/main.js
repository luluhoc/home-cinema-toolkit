import express from 'express';
import { urlencoded, json } from 'body-parser';

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 12399;

app.use(urlencoded({
  extended: true,
}));
app.use(json());
app.use('/public', express.static(`${__dirname}/public`));

app.use('/api/movies', require('./routes/api/v1/index'));

app.listen(PORT, () => console.log(`Radarr Toolkit Server Has Started on ${PORT}!`)); '';
