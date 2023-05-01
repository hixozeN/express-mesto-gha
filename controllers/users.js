const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const User = require('../models/userSchema');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send({ data: userData });
      } else {
        res.status(404).send({ message: 'Пользователь с таким ID не найден.' });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Введен некорректный ID (${req.params.userId}), который невозможно обработать.` });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(201).send({ data: userData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUserData) => res.status(200).send({ data: updatedUserData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => {
      if (newAvatar) {
        res.status(200).send({ data: newAvatar });
      } else {
        res.status(404).send({ message: 'Некорректный ID пользователя.' });
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateAvatar,
};
