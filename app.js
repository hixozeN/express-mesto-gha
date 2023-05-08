const express = require('express');
const mongoose = require('mongoose');

const app = express();
const rateLimit = require('express-rate-limit'); // limiter
const helmet = require('helmet'); // https://expressjs.com/ru/advanced/best-practice-security.html
const { errors } = require('celebrate');
const { PORT, MONGO_DB } = require('./utils/config');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const responseHandler = require('./middlewares/responseHandler');

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true, // make this also true
});

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

app.use('/users', authMiddleware, require('./routes/userRouter'));
app.use('/cards', authMiddleware, require('./routes/cardRouter'));

app.use('/signin', login);
app.use('/signup', createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Указанный путь не найден.' });
});

app.use(errors());
app.use(responseHandler);

app.listen(PORT, () => console.log('Server started on port:', PORT));
