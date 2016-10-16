const { Left, Right } = require('./either');

module.exports = (a) =>
  a != null ? Right(a)
  :/*else*/   Left(a);
