module.exports = (method, transformation) => {
  if (typeof transformation !== 'function') {
    throw new TypeError(`${method} expects a function, but was given ${transformation}.`);
  }
};
