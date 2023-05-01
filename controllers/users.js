const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;
const User = require("../models/userSchema");

getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send({ data: userData })
      } else {
        res.status(404).send({ message: 'Пользователь с таким ID не найден.'})
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Введен некорректный ID (${req.params.userId}), который невозможно обработать.` })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }, { runValidators: true })
    .then((userData) => res.status(201).send({ data: userData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}`})
      }
    });
};

updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(updatedUserData => res.status(200).send({ data: updatedUserData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}`});
      }
    });
}

updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(newAvatar => res.status(200).send({ data: newAvatar}))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}`});
      }
    });
}

module.exports = { getAllUsers, getUser, createUser, updateUser, updateAvatar };
