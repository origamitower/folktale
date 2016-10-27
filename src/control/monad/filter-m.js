//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const curry = require('folktale/core/lambda/curry/')
module.exports = curry(3, (mConstructor, f, listM) => {
  return listM.reduce((mList, element) => mList.chain((list) =>
    f(element).chain((include) => {
      if (include) {
        list.push(element)
        return mConstructor.of(list)
      } else {
        return mList
      }
    }))
  , mConstructor.of([]))

})
