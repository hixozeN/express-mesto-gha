const { celebrate, Joi } = require('celebrate');

const regexp = /(http:\/\/(?:www.|(?!www))[A-z0-9-]+\.[^\s]+\.[^\s]+)|(https:\/\/(?:www.|(?!www))[A-z0-9-]+\.[^\s]+\.[^\s]+)/;

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexp),
  }),
});

module.exports = {
  validateUserId, validateUserUpdate, validateUpdateAvatar,
};
