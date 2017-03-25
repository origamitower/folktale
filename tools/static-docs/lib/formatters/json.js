'use strict';

//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

var toJSON = function toJSON(entities, options) {
  return {
    filename: 'entities.json',
    content: entities
  };
};

module.exports = toJSON;