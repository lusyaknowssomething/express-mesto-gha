const express = require('express');
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('express').Router();
const {
  getUsers,
  getUserById,
  getMyProfile,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { urlValidation } = require('../middlewares/urlValidation');

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', getMyProfile);
usersRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
usersRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
usersRoutes.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation),
  }),
}), updateAvatar);

exports.usersRoutes = usersRoutes;
