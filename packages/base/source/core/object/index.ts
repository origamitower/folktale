//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * A set of utilities for working with JavaScript objects as dictionaries.
 */
import fromPairs from './from-pairs'
import mapEntries, { overwrite as mapEntriesOverwriting, unique as mapUniqueEntries } from './map-entries'
import mapValues, { infix as mapValuesInfix } from './map-values'
import toPairs from './to-pairs'
import values from './values'

export { 
  fromPairs,
  mapEntries, mapEntriesOverwriting, mapUniqueEntries,
  mapValues, mapValuesInfix,
  toPairs,
  values
};
