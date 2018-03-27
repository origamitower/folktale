/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {HasTypeAndTag, tagSymbol} from '../abstract/symbols';
import {deriveDebugRepresentation} from './deriveDebugRepresentation';
import {deriveEquals} from './deriveEquality';
import {derivePatternMatching} from './derivePatternMatching';

/* class decorator to add equality methods */
export function deriveStandardMethods<A extends string, T extends {new(...args:any[]): HasTypeAndTag}>(constructor: T): T {
    return compose(deriveDebugRepresentation, derivePatternMatching, deriveEquals)(constructor);
}

// --[ Helpers ]--------------------------------------------------------

// ToDo: Move this to a general purpose file:
const compose = <A>(...fns: Array<(_: any) => any>) => (initialInput: A) => fns.reduceRight(
    (input: any, fn: (_: any) => any) => fn(input),
    initialInput
);
