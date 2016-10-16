const { typeSymbol } = require('folktale/core/adt/data');

module.exports = (type) => (method, value) => {
  const typeName = type[typeSymbol];
  if (process.env.FOLKTALE_ASSERTIONS !== 'none' && !(type.isPrototypeOf(value))) {
    console.warn(`${typeName}.${method} expects a value of the same type, but was given ${value}.`);

    if (process.env.FOLKTALE_ASSERTIONS !== 'minimal') {
      console.warn(`
This could mean that you've provided the wrong value to the method, in
which case this is a bug in your program, and you should try to track
down why the wrong value is getting here.

But this could also mean that you have more than one ${typeName} library
instantiated in your program. This is not **necessarily** a bug, it
could happen for several reasons:

 1) You're loading the library in Node, and Node's cache didn't give
    you back the same instance you had previously requested.

 2) You have more than one Code Realm in your program, and objects
    created from the same library, in different realms, are interacting.

 3) You have a version conflict of folktale libraries, and objects
    created from different versions of the library are interacting.

If your situation fits the cases (1) or (2), you are okay, as long as
the objects originate from the same version of the library. Folktale
does not rely on reference checking, only structural checking. However
you'll want to watch out if you're modifying the ${typeName}'s prototype,
because you'll have more than one of them, and you'll want to make
sure you do the same change in all of them — ideally you shouldn't
be modifying the object, though.

If your situation fits the case (3), you are *probably* okay if the
version difference isn't a major one. However, at this point the
behaviour of your program using ${typeName} is undefined, and you should
try looking into why the version conflict is happening.

Parametric modules can help ensuring your program only has a single
instance of the folktale library. Check out the Folktale Architecture
documentation for more information.
      `);
    }
  }
};
