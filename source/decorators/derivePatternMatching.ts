/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {HasTypeAndTag, tagSymbol} from '../abstract/symbols';

/* class decorator to add equality methods */
export function derivePatternMatching<A extends string, T extends {new(...args:any[]): HasTypeAndTag}>(constructor: T) {
    return class extends constructor {
        // ToDo make this function typesafe.
        matchWith<B>(pattern: {[k: string]: (_: any) => B}) {
            return pattern[(this.constructor as any)[tagSymbol]](this);
        }
    };
}

