const Card = require('../models/card');

exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.params.cardId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
