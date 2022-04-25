const express = require('express');
const cardsRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', express.json(), createCard);
cardsRoutes.delete('/cards/:cardId', deleteCardById);
cardsRoutes.put('/cards/:cardId/likes', likeCard);
cardsRoutes.delete('/cards/:cardId/likes', dislikeCard);

exports.cardsRoutes = cardsRoutes;
