const _ = require('folktale/helpers/unsupported-method');

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

describe('unsupported-method', function() {

    it('throws intentionally with your method and object injected into the error', () => {
        const wrapper = () => _('method')('my object');
        $ASSERT(methodThrowsError(wrapper)() === true);
    });

});
