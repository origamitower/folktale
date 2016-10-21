//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const copyDocs = require('./copy-documentation');

const defineAdtMethod = (adt, definitions) => {
  Object.keys(definitions).forEach(name => {
    const methods = definitions[name];
    adt.variants.forEach(variant => {
      const method = methods[variant.tag];
      if (!method) {
        throw new TypeError(`Method ${name} not defined for ${variant.tag}`);
      }
      copyDocs(methods, method);
      variant.prototype[name] = method;
    });
  })
};

module.exports = defineAdtMethod;
