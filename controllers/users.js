const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

//  const { NODE_ENV, JWT_SECRET } = process.env;
const NODE_ENV = 'production';
const JWT_SECRET = '2579fbccda8e4be89f57775208647cf8';

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((error) => next(error));
};

exports.getUserById = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

exports.getMyProfile = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user.length >= 1) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Не удалось найти пользователя');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при поиске пользователя');
      } else {
        next(error);
      }
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(error);
      }
    });
};

exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении пользователя.');
      } else {
        next(error);
      }
    });
};

exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((userAvatar) => {
      if (userAvatar) {
        res.send({ data: userAvatar });
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      } else {
        next(error);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthorizedError('Не передан email или пароль');
  } else {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .end();
      })
      .catch(next);
  }
};
