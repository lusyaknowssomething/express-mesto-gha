const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const cardsRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const urlValidation = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message('Введите корректную ссылку');
  }
  return value;
};

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidation),
  }),
}), createCard);
cardsRoutes.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCardById);
cardsRoutes.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
cardsRoutes.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

exports.cardsRoutes = cardsRoutes;
