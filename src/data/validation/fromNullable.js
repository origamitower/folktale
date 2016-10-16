const { Success, Failure } = require('./validation');

module.exports = (a) =>
  a != null ? Success(a)
  :/*else*/   Failure(a);
