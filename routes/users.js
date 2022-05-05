const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const usersRoutes = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const urlValidation = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message('Введите корректную ссылку');
  }
  return value;
};

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/:userId', getUserById);
usersRoutes.post('/users', express.json(), createUser);
usersRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRoutes.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation),
  }),
}), updateAvatar);

exports.usersRoutes = usersRoutes;
