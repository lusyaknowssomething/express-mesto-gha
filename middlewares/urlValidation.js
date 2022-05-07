const validator = require('validator');

exports.urlValidation = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message('Введите корректную ссылку');
  }
  return value;
};
