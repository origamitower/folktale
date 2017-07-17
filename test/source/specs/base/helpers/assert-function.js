const _ = require('folktale/helpers/assert-function');

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

describe('assert-function', function() {

    it('throws if your transformation is not a function', () => {
        const wrapper = () => _('method', 'imma string not a function');
        $ASSERT(methodThrowsError(wrapper) == true);
    });

    it('does not throw if your transformation is a function', () => {
        const wrapper = () => _('method', ()=>{});
        $ASSERT(methodThrowsError(wrapper) == false);
    });

    it('returns undefined', () => {
        $ASSERT(_('method', ()=>{}) == undefined);
    });

});
