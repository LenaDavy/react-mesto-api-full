const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handleCors = require('./middlewares/handleCors');
const { requestLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const app = express();
app.use(handleCors);
app.use(cookieParser());
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.listen(PORT);
