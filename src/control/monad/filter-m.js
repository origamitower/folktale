//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const curry = require('folktale/core/lambda/curry/');

module.exports = curry(3, (m, f, list) =>
  list.reduce((mList, a) => 
      mList.chain((list) =>
        f(a).chain((includeA) => {
          if (includeA) {
            list.push(a);
            return m.of(list);
          } else {
            return mList;
          }
        }))
  , m.of([])));
