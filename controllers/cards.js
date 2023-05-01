const Card = require("../models/cardSchema");

getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => res.status(400).send({ message: err.message }));
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
    .catch((err) => res.status(400).send({ message: err.message }));
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
    .catch((err) => res.status(400).send({ message: err.message }));
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
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };
