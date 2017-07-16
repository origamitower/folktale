//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const _ = require('folktale/helpers/assert-has');

// --[ Helpers ]--------------------------------------------------------
const methodThrowsError = method => () => {
    try {
        method();
        return false;
    }
    catch(err) {
        return true;
    }
};

describe('assert-has', () => {

    describe("#methodThrowsError", () => {
         it('methodThrowsError works with no error', ()=> {
            $ASSERT(methodThrowsError(()=>{})() === false);
        });

        it('methodThrowsError works with error', ()=> {
            $ASSERT(methodThrowsError(()=>{throw new Error('b00mz')})() === true);
        });
    });

    it('does not throw if you pass in a function', ()=> {
        const fixture = {
            noop: ()=>{}
        };
        const testFixture = ()=> _('test', fixture, 'noop');
        const fixtureThrows = methodThrowsError(testFixture);
        $ASSERT(fixtureThrows() === false);
    });

    it('throws if you pass in a function that throws an error', ()=> {
        const testFixture = ()=> _('test', {}, 'noop');
        const fixtureThrows = methodThrowsError(testFixture);
        $ASSERT(fixtureThrows() === true);
    });

    it('returns nothing', () => {
        const fixture = {
            noop: ()=>{}
        };
        const equalsNothing = (item) => item === undefined;
        const result = _('test', fixture, 'noop');
        $ASSERT(equalsNothing(result) === true);
    });

});
