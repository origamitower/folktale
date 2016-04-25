const { Left, Right } = require('./core');

module.exports = (a) =>
  a != null ? Right(a)
  :/*else*/   Left(a);
