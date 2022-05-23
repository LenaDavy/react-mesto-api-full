const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { errorLogger } = require('../middlewares/logger');
const handleError = require('../middlewares/handleError');
const regexp = require('../utils/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexp),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), login);

router.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

router.use(errorLogger);

router.use(errors());

router.use((err, req, res, next) => { handleError(err, res, next); });

module.exports = router;
