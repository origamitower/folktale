//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const env = require("folktale/env/helpers");
const BLAME_FUNCTION_INDEX = 3; // [current, parent, *error*, caller to blame, …]

function warnDeprecation(reason) {    // eslint-disable-line max-statements
  const assertions = env("FOLKTALE_ASSERTIONS", "minimal");
  if (assertions !== 'none') { 
    const stack = new Error('').stack;
    let offender;
    if (stack) {
      const lines = stack.split('\n');
      offender = lines[BLAME_FUNCTION_INDEX];
    }

    if (offender) {
      console.warn(`${reason}\n    Blame: ${offender.trim()}`);
    } else {
      console.warn(reason);
    }
  }
}

module.exports = warnDeprecation;
