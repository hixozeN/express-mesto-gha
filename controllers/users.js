const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

const { ValidationError, CastError } = mongoose.Error;
const User = require('../models/userSchema');
const BadRequest = require('../utils/responsesWithError/BadRequest');
const NotFound = require('../utils/responsesWithError/NotFound');
const Duplicate = require('../utils/responsesWithError/Duplicate');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
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

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Введен некорректный ID, который невозможно обработать.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь с таким ID не найден.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!password) return next(new BadRequest('Поле "password" должно быть заполнено.'));

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message));
      } else if (err.code === 11000) {
        next(new Duplicate('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((updatedUserData) => res.send({ data: updatedUserData }))
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequest(err.message));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь с таким ID не найден.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequest(err.message));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Некорректный ID пользователя.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar, login,
};
