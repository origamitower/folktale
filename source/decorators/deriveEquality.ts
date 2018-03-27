/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {Setoid} from '../abstract/setoid';
import {assertType} from '../helpers/assert-type';
import {HasTypeAndTag, typeSymbol, tagSymbol} from '../abstract/symbols';
import { equals as flEqualsSymbol } from '../helpers/fantasy-land';

const flEquals = require('folktale/fantasy-land/equals');


/* class decorator to add equality methods */
export function deriveEquals<A extends string, T extends {new(...args:any[]): HasTypeAndTag}>(constructor: T) {
    return class extends constructor implements Setoid<A>{
        equals(other: any): boolean {
            return setoidEquals(this, other);
        }

        /* Derived methods: */
        [flEqualsSymbol](other: any): boolean {
            return this.equals(other);
        }
    };
}

// --[ Helpers ]--------------------------------------------------------

const prototypeOf = Object.getPrototypeOf;
const toString = Object.prototype.toString;

/*~
 * type: (Any) => Boolean
 */
const isSetoid = (value: any) => value != null
    && (typeof value[flEqualsSymbol] === 'function' || typeof value.equals === 'function');

/*~
 * type: (Variant, Variant) => Boolean
 */
const sameType = (a: HasTypeAndTag, b: HasTypeAndTag) => (a.constructor as any)[typeSymbol] === (b.constructor as any)[typeSymbol]
    && (a.constructor as any)[tagSymbol] === (b.constructor as any)[tagSymbol];

const isPlainObject = (object: any) => {
    if (Object(object) !== object)  return false;

    return !prototypeOf(object)
        ||     !object.toString
        ||     (toString.call(object) === object.toString());
};


const deepEquals = (a: any, b: any): boolean => {
    if (a === b)  return true;

    const leftSetoid  = isSetoid(a);
    const rightSetoid = isSetoid(b);
    if (leftSetoid) {
        if (rightSetoid)  return flEquals(a, b);
        else              return false;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length
            &&     a.every((x, i) => deepEquals(x, b[i]));
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        const setB = new Set(keysB);
        return keysA.length === keysB.length
            &&     prototypeOf(a) === prototypeOf(b)
            &&     keysA.every(k => setB.has(k) && a[k] === b[k]);
    }

    return false;
};

// --[ Implementation ]------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - "@davidlibland"
 */
const equalityConstructor = (valuesEqual: (a: any, b: any) => boolean) => {
    /*~
     * type: ('a, 'a) => Boolean
     */
    const equals = (a: any, b: any) => {
        // identical objects must be equal
        if (a === b)  return true;

        // we require both values to be setoids if one of them is
        const leftSetoid  = isSetoid(a);
        const rightSetoid = isSetoid(b);
        if (leftSetoid) {
            if (rightSetoid)  return flEquals(a, b);
            else              return false;
        }

        // fall back to the provided equality
        return valuesEqual(a, b);
    };


    /*~
     * type: (Object Any, Object Any, Array String) => Boolean
     */
    const compositesEqual = (a: any, b: any, keys: string[]) => {
        for (let i = 0; i < keys.length; ++i) {
            const keyA = a[keys[i]];
            const keyB = b[keys[i]];
            if (!(equals(keyA, keyB))) {
                return false;
            }
        }
        return true;
    };

    return (first: HasTypeAndTag, second: any) =>
        sameType(first, second) && compositesEqual(first, second, Object.keys(first));
};

const setoidEquals = equalityConstructor(deepEquals);
