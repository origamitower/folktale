//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// [jwarden 7.14.2017] NOTE: Can of worms below. I'm concerned based on how much work went into Lodash's has for example.
// And has only checks Objects, not if it's a class and walking up the prototype tree.
// Sooo... this assumes:
// 1. it's an Object, not a class, nor Array
// 2. a basic hasOwnProperty check 
module.exports = (method, object, property) => {
  if (!object || typeof property !== 'string' || object.hasOwnProperty(property) === false) {
    throw new Error(`Variant "${property}" not covered in pattern.
        This could mean you did not include all variants in your Union's matchWith function.

        For example, if you had this Union:

        const Operation = union({
            Add: (a, b) => ({ a, b }),
            Subtract: (a, b) => ({ a, b }),
        })

        But wrote this matchWith:

        op.matchWith({
            Add: ({ a, b }) => a + b
            // Subtract not implemented!
        })

        It would throw this error because we need to check against 'Subtract'. Check your matchWith function inside of the ${method} method, it's possibly missing the '${property}' in the Object you pass to 'matchWith'.`);
  }
};
