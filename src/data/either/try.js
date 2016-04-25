const { Left, Right } = require('./core');

module.exports = (f) => (...args) => {
  try {
    return Right(f(...args));
  } catch (e) {
    return Left(e);
  }
};
