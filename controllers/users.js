const User = require('../models/user');

exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        return res.status(200).send({});
      }
      return res.send({ data: users });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Не удалось найти пользователя' });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он не будет создан
    },
  )
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userData });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.updateAvatar = (req, res) => {
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
      if (!userAvatar) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: userAvatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
