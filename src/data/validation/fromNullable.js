const { Success, Failure } = require('./core');

module.exports = (a) =>
  a != null ? Success(a)
  :/*else*/   Failure(a);
