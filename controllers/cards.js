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
    .orFail()
    .catch(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new NotFoundError('Невозможно удалить чужую карточку');
      }
      Card.findByIdAndRemove(cardId)
        .then((cardForDelete) => {
          res.send({ data: cardForDelete });
        })
        .catch((error) => {
          if (error.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные при удалении карточки');
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .catch(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((card) => res.send({ card }))
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
    .orFail()
    .catch(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      } else {
        next(error);
      }
    });
};
