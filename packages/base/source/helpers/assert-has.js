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
module.exports = (method, object, property, customErrorMessage = '') => {
    if (!object || typeof property !== 'string' || object.hasOwnProperty(property) === false) {
        if (customErrorMessage === '') {
            throw new Error(`${object} does not have a property ${property}.`);
        }
        else {
            throw new Error(customErrorMessage);
        }
    }
};
