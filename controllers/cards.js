// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;
const Card = require('../models/cardSchema');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res
          .status(404)
          .send(
            { message: `Передан несуществующий ID карточки: ${req.params.cardId}.` },
          );
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Введен некорректный ID (${req.params.cardId}), который невозможно обработать.` });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: `Передан несуществующий ID карточки: ${req.params.cardId}.` });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: `Передан несуществующий ID карточки: ${req.params.cardId}.` });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
