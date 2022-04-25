const express = require('express');
const usersRoutes = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/:userId', getUserById);
usersRoutes.post('/users', express.json(), createUser);
usersRoutes.patch('/users/me', express.json(), updateUser);
usersRoutes.patch('/users/me/avatar', express.json(), updateAvatar);

exports.usersRoutes = usersRoutes;
