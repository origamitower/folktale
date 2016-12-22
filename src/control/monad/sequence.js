//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
//

const curry = require('folktale/core/lambda/curry/');

module.exports = curry(2, (m, listM) => 
  listM.reduce((mList, mA) => 
    mList.chain((list) => 
      mA.chain((a) => {
        list.push(a);
        return m.of(list);
      }))
  , m.of([])));
