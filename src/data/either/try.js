const { Left, Right } = require('./either');

module.exports = (f) => (...args) => {
  try {
    return Right(f(...args));
  } catch (e) {
    return Left(e);
  }
};
