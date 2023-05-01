const User = require("../models/userSchema");

getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send({ data: userData })
      } else {
        res.status(404).send(`Пользователь с таким ID не найден.`)
      }
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(201).send({ data: userData }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

updateUser = (req, res) => {
  const { name, about } = req.body;
  if (!name) {
    res.status(400).send({ message: 'Поле name не должно быть пустым!'})
    return;
  }
  if (!about) {
    res.status(400).send({ message: 'Поле about не должно быть пустым!'})
    return;
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(updatedUserData => res.status(200).send({ data: updatedUserData }))
    .catch((err) => res.status(400).send({ message: err.message }));
}

updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(newAvatar => res.status(200).send({ data: newAvatar}))
    .catch((err) => res.status(400).send({ message: err.message }));
}

module.exports = { getAllUsers, getUser, createUser, updateUser, updateAvatar };
