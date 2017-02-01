@annotate: folktale.data.result
---

A data structure that models the result of operations that may fail. A `Result`
helps with representing errors and propagating them, giving users a more
controllable form of sequencing operations with the power of constructs like
`try/catch`.

A `Result` may be either an `Ok(value)`, which contains a successful value, or
an `Error(value)`, which contains an error.


## Example::

    const Result = require('folktale/data/result');
    const { data, setoid, show } = require('folktale/core/adt');
    
    const DivisionErrors = data('division-errors', {
      DivisionByZero(dividend) {
        return { dividend };
      }
    }).derive(setoid, show);
    
    const { DivisionByZero } = DivisionErrors;
    
    
    const divideBy = (dividend, divisor) => 
      divisor === 0 ?  Result.Error(DivisionByZero(dividend))
    : /* otherwise */  Result.Ok(Math.floor(dividend / divisor));
    
    divideBy(4, 2);
    // ==> Result.Ok(2)
    
    divideBy(4, 0);
    // ==> Result.Error(DivisionByZero(4))


## Why use Result?

Sometimes functions fail, for many reasons: someone might have provided an
unexpected value to it, the internet connection might have gone down in the
middle of an HTTP request, the database might have died. Regardless of which
reason, we have to handle these failures. And, of course, we'd like to handle
failures in the simplest way possible.

In JavaScript you're often left with two major ways of dealing with these
failures: a branching instruction (like `if/else`), or throwing errors and
catching them.

Branching stops being a very feasible thing after a couple of cases. It's very
simple to forget to handle failures (often with catastrophic effects, as can be
seen in things like NullPointerException and the likes), and there's no error
propagation, so every part of the code has to handle the same error over and
over again::

    const isValidEmail = (email) => /(.+)@(.+)/.test(email);
    
    const isValidPhone = (phone) => /^\d+$/.test(phone);

    const validateBranching = ({ name, type, email, phone }) => {
      if (name.trim() === '') {
        return '`name` can’t be empty.';
      } else if (type === 'email') {
        if (!isValidEmail(email)) {
          return 'Please provide a valid email';
        } else if (phone && !isValidPhone(phone)) {
          return 'The phone number is not valid';
        } else {
          return { type, name, email, phone };
        }
      } else if (type === 'phone') {
        if (!isValidPhone(phone)) {
          return 'Please provide a valid phone number';
        } else if (email && !isValidEmail(email)) {
          return 'The email is not valid';
        } else {
          return { type, name, email, phone };
        }
      } else {
        return 'The type should be either `phone` or `email`';
      }
    };
    
    
    validateBranching({
      name: 'Max',
      type: 'email',
      phone: '11234456'
    });
    // ==> 'Please provide a valid email'
    
    validateBranching({
      name: 'Alissa',
      type: 'email',
      email: 'alissa@somedomain'
    });
    // ==> { type: 'email', name: 'Alissa', email: 'alissa@somedomain', phone: undefined }


Exceptions (with the `throw` and `try/catch` constructs) alleviate this a bit.
They don't solve the cases where you forget to handle a failure—although that
often results in crashing the process, which is better than continuing but doing
the wrong thing—, but they allow failures to propagate, so fewer places in the
code need to really deal with the problem::

    const assertEmail = (email) => {
      if (!isValidEmail(email)) {
        throw new Error('Please provide a valid email');
      }
    };
    
    const assertPhone = (phone) => {
      if (!isValidPhone(phone)) {
        throw new Error('Please provie a valid phone number');
      }
    };

    const validateThrow = ({ name, type, email, phone }) => {
      if (name.trim() === '') {
        throw new Error('`name` can’t be empty');
      }
      switch (type) {
        case 'email':
          assertEmail(email);
          if (phone)  assertPhone(phone);
          return { type, name, email, phone };
          
        case 'phone':
          assertPhone(phone);
          if (email)  assertEmail(email);
          return { type, name, email, phone };
          
        default:
          throw new Error('The type should be either `phone` or `email`');
      }
    };


    try {
      validateThrow({
        name: 'Max',
        type: 'email',
        phone: '11234456'
      });
    } catch (e) {
      e.message; // ==> 'Please provide a valid email'
    }
    
    validateThrow({
      name: 'Alissa',
      type: 'email',
      email: 'alissa@somedomain'
    });
    // ==> { type: 'email', name: 'Alissa', email: 'alissa@somedomain', phone: undefined }
    

On the other hand, the error propagation that we have with `throw` doesn't tell
us much about how much of the code has actually been executed, and this is
particularly problematic when you have side-effects. How are you supposed to
recover from a failure when you don't know in which state your application is?

`Result` helps with both of these cases. With a `Result`, the user is forced to
be aware of the failure, since they're not able to use the value at all without
unwrapping the value before. At the same time, using a `Result` value will
automatically propagate the errors when they're not handled, making error
handling easier. Since `Result` runs one operation at a time when you use the
value, and does not do any dynamic stack unwinding (as `throw` does), it's much
easier to understand in which state your application should be.



