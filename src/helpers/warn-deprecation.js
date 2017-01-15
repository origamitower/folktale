//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

function warnDeprecation(reason) {
  if (process.env.FOLKTALE_ASSERTIONS !== 'none') { 
    const stack = new Error('').stack;
    let offender;
    if (stack) {
      const lines = stack.split('\n');
      offender = lines[3];
    }

    if (offender) {
      console.warn(`${reason}\n    Blame: ${offender.trim()}`);
    } else {
      console.warn(reason);
    }
  }
}

module.exports = warnDeprecation;
