const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const Card = require('../models/cardSchema');
const BadRequest = require('../utils/responsesWithError/BadRequest');
const NotFound = require('../utils/responsesWithError/NotFound');
const Forbidden = require('../utils/responsesWithError/Forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((foundCard) => {
      if (!foundCard.owner.equals(req.user._id)) return next(new Forbidden('Эта карточка принадлежит другому пользователю.'));

      return Card.findByIdAndRemove(req.params.cardId)
        .then((card) => res.send({ data: card }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Введен некорректный ID, который невозможно обработать.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные при лайке.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные при дизлайке.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFound('Передан несуществующий ID карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
