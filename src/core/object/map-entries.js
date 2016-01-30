//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const hasOwnProperty = Object.prototype.hasOwnProperty;


const mapEntries = (object, transform, define) =>
        Object.keys(object).reduce((result, key) => {
          const [newKey, newValue] = transform([key, object[key]]);
          return define(result, newKey, newValue);
        }, {});


mapEntries.overwrite = (object, transform) =>
  mapEntries(object, transform, (result, key, value) => {
    result[key] = value;
    return result;
  });

mapEntries.unique = (object, transform) =>
  mapEntries(object, transform, (result, key, value) => {
    if (result::hasOwnProperty(key)) {
      throw new Error(`The property ${key} already exists in the resulting object.`);
    }
    result[key] = value;
    return result;
  });


module.exports = mapEntries;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  mapEntries.overwrite[Symbol.for('@@meta:magical')] = {
    name: 'overwrite',
    signature: 'overwrite(object, transform)',
    type: `
(
  { String -> α },
  (#[String, α]) -> #[String, β]
) -> { String -> β }
    `,
    category: 'Transforming',
    complexity: 'O(n), n is the number of own enumerable properties',
    belongsTo: mapEntries,
    seeAlso: [
      {
        type: 'entity',
        path: 'mapEntries.unique',
        reason: 'Consistently throws when a collision happens.'
      }
    ],
    documentation: `
Transforms pairs of (key, value) own properties in a plain object.

This function is a specialised form of [[mapEntries]] that overwrites
duplicated keys when a collision happens. Because of this, the result
of a transformation where keys collide is not defined in ECMAScript 5
and older, but in ECMAScript 2015 properties that were inserted later
will win over properties that were inserted earlier.
    `
  };

  mapEntries.unique[Symbol.for('@@meta:magical')] = {
    name: 'unique',
    signature: 'unique(object, transform)',
    type: `
(
  { String -> α },
  (#[String, α]) -> #[String, β]
) -> { String -> β } :: throws
    `,
    category: 'Transforming',
    complexity: 'O(n), n is the number of own enumerable properties',
    belongsTo: mapEntries,
    seeAlso: [
      {
        type: 'entity',
        path: 'mapEntries.overwrite',
        reason: 'Safely overwrites keys when a collision happens.'
      }
    ],
    documentation: `
Transforms pairs of (key, value) own properties in a plain object.

This function is a specialised form of [[mapEntries]] that throws
when a key collision happens. Throwing makes this function potentially
unsafe to use, however it guarantees a consistent behaviour across
different ECMAScript versions and VMs.
    `
  };

  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'mapEntries',
    signature: 'mapEntries(object, transform, define)',
    type: `
(
  { String -> α },
  (#[String, α]) -> #[String, β],
  ({ String -> β}, String, β) -> { String -> β } :: mutate?
) -> { String -> β }
    `,
    category: 'Transforming',
    stability: 'stable',
    platforms: ['ECMAScript 5'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/object/map-entries',
    portability: 'Supported in older ES VMs with es5-shim',
    complexity: 'O(n), n is the number of own enumerable properties',
    documentation: `
Transforms pairs of (key, value) own properties in a plain object.

The transformation takes a [key, value] pair, and is expected to return
a new [key, value] pair. The resulting object has not only its values
transformed, but also its keys:

    const pair = { x: 10, y: 20 };
    mapEntries(
      pair,
      ([k, v]) => [k.toUpperCase(), v * 2],
      (r, k, v) => Object.assign(r, { [k]: v })
    );
    // => { X: 20, Y: 40 }

> **NOTE**
> The function expects you to provide a definition function, which will
> determine how to handle the mapping of the returned pairs. This is
> necessary because no single behaviour is always the right one for
> this. Common behaviours, such as \`overwrite\` older properties,
> and enforcing \`unique\` properties are provided as specialised
> frorms of this function.


> **NOTE**
> The definition function may mutate the object.


> **WARNING**
> [[mapEntries]] will not preserve the shape of the original object.
> It treats objects as plain maps from String to some value. It ignores
> things like prototypical delegation, symbols, and non-enumerable
> properties.
    `
  };
}
