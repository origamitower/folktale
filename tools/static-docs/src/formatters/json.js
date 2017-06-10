//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

const toJSON = (entities, options) => {
  return [{ 
    filename: 'entities.json',
    content: JSON.stringify(entities, null, 2)
  }];
};

module.exports = toJSON;
