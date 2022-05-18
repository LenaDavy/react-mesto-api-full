require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let { Authorization } = req.headers;
    if (!Authorization || !Authorization.startsWith('Bearer ')) {
      return next(new Unauthorized('Необходима авторизация'));
    } let token = Authorization.replace('Bearer ', '');
      try {
        token = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      } catch (err) {
        return next(new Unauthorized('Необходима авторизация'));
      } req.user = token;
  return next();
};
