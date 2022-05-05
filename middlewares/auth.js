const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

// const { NODE_ENV, JWT_SECRET } = process.env;

const NODE_ENV = 'production';
const JWT_SECRET = '2579fbccda8e4be89f57775208647cf8';

exports.Auth = (req, res, next) => {
  const token = req.cookies.jwt;
  // if (!token) {
  //   return res.status(401).send({ message: 'Необходимо залогиниться' });
  // }
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
