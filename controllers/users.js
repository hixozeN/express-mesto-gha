const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const User = require('../models/userSchema');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Что-то пошло не так: ${err}` }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Введен некорректный ID (${req.params.userId}), который невозможно обработать.` });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с таким ID не найден.' });
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
    .orFail(new Error('NotValidId'))
    .then((updatedUserData) => {
      if (updatedUserData) {
        res.send({ data: updatedUserData });
      } else {
        res.status(404).send({ message: 'Пользователь с таким ID не найден.' });
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с таким ID не найден.' });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Некорректный ID пользователя.' });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateAvatar,
};
