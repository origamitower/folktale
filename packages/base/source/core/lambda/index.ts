//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * The Lambda module provides common utilities for combining and
 * transforming functions.
 */
import compose, { all as composeAll, infix as composeInfix } from './compose'
import constant from './constant'
import identity from './identity'
import partialize, { hole } from './partialize'

export { 
  compose, composeAll, composeInfix, 
  constant, 
  identity, 
  partialize, hole 
}