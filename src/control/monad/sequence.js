//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
//

const curry = require('folktale/core/lambda/curry/')
module.exports = curry(2, (mConstructor, listM) => 
  listM.reduce((mList, mElement) => 
    mList.chain((list) => 
      mElement.chain((element) => {
        list.push(element)
        return mConstructor.of(list)
      }))
  , mConstructor.of([])))
