const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((error) => next(error));
};

exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        next(error);
      }
    });
};

exports.deleteCardById = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new UnauthorizedError('Невозможно удалить чужую карточку');
      }

      Card.findByIdAndRemove(cardId)
        .then((cardForDelete) => {
          if (cardForDelete) {
            res.send({ data: cardForDelete });
          } else {
            throw new NotFoundError('Карточка с указанным _id не найдена.');
          }
        })
        .catch((error) => {
          if (error.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные при удалении карточки');
          } else {
            next(error);
          }
        });
    });
};

exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      } else {
        next(error);
      }
    });
};

exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.params.cardId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      } else {
        next(error);
      }
    });
};
