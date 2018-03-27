/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {equals as flEqualsSymbol} from '../helpers/fantasy-land';

export abstract class Setoid<A extends string> {
    abstract equals(other: any): boolean;
    /* Derived methods */
    [flEqualsSymbol](other: any): boolean {
        return this.equals(other);
    }
}
