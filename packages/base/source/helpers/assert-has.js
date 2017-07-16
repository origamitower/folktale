//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (method, object, property, customErrorMessage = '') => {
    if (!(property in object)) {
        if (customErrorMessage === '') {
            throw new Error(`${object} does not have a property ${property}.`);
        }
        else {
            throw new Error(customErrorMessage);
        }
    }
};
