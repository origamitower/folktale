
const { property, forall} = require('jsverify');
const _ = require('folktale/helpers/defer');
const laws = require('../../../helpers/fantasy-land-laws');

// --[ Helpers ]-------------------------------------------------------
function aNumberImmediateOrUndefined(o) {
    if(typeof o == 'number' || typeof o === 'object' || typeof o == 'undefined') {
        return true;
    } else {
        return false;
    }
}

describe('defer', function() {

    it('calls your function', done => {
        const callback = () => {
            $ASSERT(true === true);
            done();
        };
        _(callback);
    });

    it('in fact defers to next event so we are in a different stack', done => {
        let counter = 0;
         const first = () => counter++;
         const second = () => {
            counter++;
            done();
         };
         first();
         _(second);
         $ASSERT(counter === 1);
    });

    it('returns a number or undefined', () => {
        const noop = () => {};
        const result = _(noop);
        $ASSERT(aNumberImmediateOrUndefined(result) == true);
    });

});