import express from 'express';
import { urlencoded, json } from 'body-parser';

require('dotenv').config();
const indexRoutes = require('./routes/index');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(urlencoded({
  extended: true,
}));
app.use(json());
app.use('/public', express.static(`${__dirname}/public`));

app.set('view engine', 'pug');

app.use(indexRoutes);

app.listen(PORT, () => console.log(`Radarr Toolkit Server Has Started on ${PORT}!`)); '';
