@annotate: folktale.result.Error.prototype.chain
@annotate: folktale.result.Ok.prototype.chain
category: Transforming
---

Transforms the value and context of a Result computation with an unary function.
As with `.map()`, the transformation is only applied if the value is an `Ok`,
but the transformation is expected a new `Result` value, which then becomes the
result of the method.


## Example::

    const Result = require('folktale/result');
    
    const divideBy = (a) => (b) =>
      a === 0        ?  Result.Error('division by zero')
    : /* otherwise */   Result.Ok(b / a);
    

    Result.Ok(4).chain(divideBy(2));
    // ==> Result.Ok(2)
    
    Result.Error(4).chain(divideBy(2));
    // ==> Result.Error(4)
    
    Result.Ok(4).chain(divideBy(0));
    // ==> Result.Error('division by zero')
