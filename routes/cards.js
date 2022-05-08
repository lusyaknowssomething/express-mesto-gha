const express = require('express');
const { celebrate, Joi } = require('celebrate');
const cardsRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { urlValidation } = require('../middlewares/urlValidation');

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation),
  }),
}), createCard);
cardsRoutes.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);
cardsRoutes.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);
cardsRoutes.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

exports.cardsRoutes = cardsRoutes;
