const assert = require('assert');

async function throws(fn, inst) {
  try {
    await fn();
  } catch (error) {
    assert.throws(() => { throw error }, inst);
  }
}

module.exports = {
  throws
}