/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const mongoDB = 'mongodb://127.0.0.1:27017/mestodb';
const rateLimit = require('express-rate-limit'); // limiter
const helmet = require('helmet'); // https://expressjs.com/ru/advanced/best-practice-security.html

mongoose.set('strictQuery', false);
mongoose.connect(mongoDB);

app.use(express.json());

// AntiDOS & helmet
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // AntiDOS на все реквесты
app.use(helmet());

// Заглушка авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '644f77ee721660af4f5b8faa',
  };

  next();
});

app.use('/users', require('./routes/userRouter'));
app.use('/cards', require('./routes/cardRouter'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Указанный путь не найден.' });
});

app.listen(PORT, () => console.log('Server started on port:', PORT));
