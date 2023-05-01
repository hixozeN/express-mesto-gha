const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;
const mongoDB = 'mongodb://127.0.0.1:27017/mestodb';

mongoose.set('strictQuery', false);
mongoose.connect(mongoDB);

app.use(express.json())

app.use((req, res, next) => {
  req.user = {
    _id: '644f77ee721660af4f5b8faa' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/userRouter'));
app.use('/cards', require('./routes/cardRouter'));
app.use('*', (req, res) => {
  res.status(404).send({ message: "Указанный путь не найден."})
})

app.listen(PORT, () => console.log('Server started on port:', PORT));
