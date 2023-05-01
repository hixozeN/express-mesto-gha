const { ValidationError, CastError } = require("mongoose").Error;
const Card = require("../models/cardSchema");

getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res
          .status(404)
          .send(
            { message: `Карточка с ID: ${req.params.cardId} не найдена и не была удалена.` }
          );
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Введен некорректный ID (${req.params.cardId}), который невозможно обработать.` })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена`});
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена`});
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: `Что-то пошло не так: ${err}` })
      }
    });
};

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };
