/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------

 --[ Dependencies ]---------------------------------------------------
*/
import {HasTypeAndTag, typeSymbol, tagSymbol} from '../abstract/symbols';
import {equals as flEqualsSymbol} from '../helpers/fantasy-land';
import {Setoid} from '../abstract/setoid';


/* class decorator to add equality methods */
export function deriveDebugRepresentation<T extends {new(...args:any[]): HasTypeAndTag}>(constructor: T) {
    const typeName    = (constructor as any)[typeSymbol];
    const variantName = `${typeName}.${(constructor as any)[tagSymbol]}`;
    return class extends constructor{
        /*~
         * stability: experimental
         * module: null
         * authors:
         *   - "@boris-marinov"
         *   - "@davidlibland"
         */
        static toString(): string {
            return variantName;
        }
        toString(): string {
            return `${variantName}(${plainObjectToString(this)})`;
        }

        // (Node REPL representations)
        static inspect(): string {
            return this.constructor.toString();
        }
        inspect(): string {
            return this.toString();
        }
    };
}


// --[ Helpers ]--------------------------------------------------------
/*~
 * type: (Object Any) => String
 */
const objectToKeyValuePairs = <T>(object: T) =>
    Object.keys(object)
        .map((key: keyof T) => `${key}: ${showValue(object[key])}`)
        .join(', ');

/*~
 * type: Object Any => String
 */
const plainObjectToString = <T>(object: T): string => `{ ${objectToKeyValuePairs(object)} }`;

/*~
 * type: Array<any> => String
 */
const arrayToString = (object: any[]): string => `[${object.map(showValue).join(', ')}]`;

/*~
 * type: (Function) => String
 */
const functionNameToString = (fn: (...args: any[]) => any): string => fn.name !== '' ? `: ${fn.name}` : '';

/*~
 * type: (Function) => String
 */
const functionToString = (fn: (...args: any[]) => any): string => `[Function${functionNameToString(fn)}]`;

/*~
 * type: () => String
 */
const nullToString = (): string => 'null';

/*~
 * type: (Null | Object Any) => String
 */
const objectToString = <T>(object: T): string =>
    object === null                       ?  nullToString()
        : Array.isArray(object)                 ?  arrayToString(object)
        : object.toString() === ({}).toString() ?  plainObjectToString(object)
            : /* otherwise */                          object.toString();


/*~
 * type: (Any) => String
 */
const showValue = (value: any): string =>
    typeof value === 'undefined' ?  'undefined'
        : typeof value === 'function'  ?  functionToString(value)
        : typeof value === 'symbol'    ?  value.toString()
            : typeof value === 'object'    ?  objectToString(value)
                : /* otherwise */                 JSON.stringify(value);
