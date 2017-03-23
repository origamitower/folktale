@annotate: folktale.data.result
category: Handling failures
---

A data structure that models the result of operations that may fail. A `Result`
helps with representing errors and propagating them, giving users a more
controllable form of sequencing operations than that offered by constructs like
`try/catch`.

A `Result` may be either an `Ok(value)`, which contains a successful value, or
an `Error(value)`, which contains an error.


## Example::

    const Result = require('folktale/data/result');
    const { data, derivations } = require('folktale/core/adt');
    
    const DivisionErrors = data('division-errors', {
      DivisionByZero(dividend) {
        return { dividend };
      }
    }).derive(
      derivations.equality,
      derivations.debugRepresentation
    );
    
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

To see how `Result` compares to these, we'll look at a function that needs to
validate some information, and that incorporates some more complex validation
rules. A person may sign-up for a service by providing the form they would
prefer being contacted (email or phone), and the information related to that
preference has to be provided, but any other info is optional::

    // Functions to assert the format of each data
    const isValidName  = (name)  => name.trim() !== '';
    const isValidEmail = (email) => /(.+)@(.+)/.test(email);
    const isValidPhone = (phone) => /^\d+$/.test(phone);

    // Objects representing each possible failure in the validation
    const { data, derivations } = require('folktale/core/adt');
    
    const ValidationErrors = data('validation-errors', {
      Required(field) {
        return { field };
      },
      
      InvalidEmail(email) {
        return { email };
      },
      
      InvalidPhone(phone) {
        return { phone };
      },
      
      InvalidType(type) {
        return { type };
      },
      
      Optional(error) {
        return { error };
      }
    }).derive(derivations.equality);
    
    const { 
      Required, 
      InvalidEmail, 
      InvalidPhone, 
      InvalidType, 
      Optional 
    } = ValidationErrors;

Branching stops being a very feasible thing after a couple of cases. It's very
simple to forget to handle failures (often with catastrophic effects, as can be
seen in things like NullPointerException and the likes), and there's no error
propagation, so every part of the code has to handle the same error over and
over again::

    const validateBranching = ({ name, type, email, phone }) => {
      if (!isValidName(name)) {
        return Required('name');
      } else if (type === 'email') {
        if (!isValidEmail(email)) {
          return InvalidEmail(email);
        } else if (phone && !isValidPhone(phone)) {
          return Optional(InvalidPhone(phone));
        } else {
          return { type, name, email, phone };
        }
      } else if (type === 'phone') {
        if (!isValidPhone(phone)) {
          return InvalidPhone(phone);
        } else if (email && !isValidEmail(email)) {
          return Optional(InvalidEmail(email));
        } else {
          return { type, name, email, phone };
        }
      } else {
        return InvalidType(type);
      }
    };
    
    
    validateBranching({
      name: 'Max',
      type: 'email',
      phone: '11234456'
    });
    // ==> InvalidEmail(undefined)
    
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

    const id = (a) => a;

    const assertEmail = (email, wrapper=id) => {
      if (!isValidEmail(email)) {
        throw wrapper(InvalidEmail(email));
      }
    };
    
    const assertPhone = (phone, wrapper=id) => {
      if (!isValidPhone(phone)) {
        throw wrapper(InvalidEmail(email));
      }
    };

    const validateThrow = ({ name, type, email, phone }) => {
      if (!isValidName(name)) {
        throw Required('name');
      }
      switch (type) {
        case 'email':
          assertEmail(email);
          if (phone)  assertPhone(phone, Optional);
          return { type, name, email, phone };
          
        case 'phone':
          assertPhone(phone);
          if (email)  assertEmail(email, Optional);
          return { type, name, email, phone };
          
        default:
          throw InvalidType(type);
      }
    };


    try {
      validateThrow({
        name: 'Max',
        type: 'email',
        phone: '11234456'
      });
    } catch (e) {
      e; // ==> InvalidEmail(undefined)
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
unwrapping the value first. At the same time, using a `Result` value will
automatically propagate the errors when they're not handled, making error
handling easier. Since `Result` runs one operation at a time when you use the
value, and does not do any dynamic stack unwinding (as `throw` does), it's much
easier to understand in which state your application should be.

Using `Result`, the previous examples would look like this::

    const Result = require('folktale/data/result');
    
    const checkName = (name) =>
      isValidName(name) ?  Result.Ok(name)
    : /* otherwise */      Result.Error(Required('name'));
    
    const checkEmail = (email) =>
      isValidEmail(email) ?  Result.Ok(email)
    : /* otherwise */        Result.Error(InvalidEmail(email));
    
    const checkPhone = (phone) =>
      isValidPhone(phone) ?  Result.Ok(phone)
    : /* otherwise */        Result.Error(InvalidPhone(phone));
    
    const optional = (check) => (value) =>
      value           ?  check(value).mapError(Optional)
    : /* otherwise */    Result.Ok(value);
    
    const maybeCheckEmail = optional(checkEmail);
    const maybeCheckPhone = optional(checkPhone);
    

    const validateResult = ({ name, type, email, phone }) =>
      checkName(name).chain(_ => 
        type === 'email' ?  checkEmail(email).chain(_ =>
                              maybeCheckPhone(phone).map(_ => ({
                                name, type, email, phone
                              }))
                            )
                            
      : type === 'phone' ?  checkPhone(phone).chain(_ =>
                              maybeCheckEmail(email).map(_ => ({
                                name, type, email, phone
                              }))
                            )
                            
      : /* otherwise */     Result.Error(InvalidType(type))
      );


    validateResult({
      name: 'Max',
      type: 'email',
      phone: '11234456'
    });
    // ==> Result.Error(InvalidEmail(undefined))
    
    validateResult({
      name: 'Alissa',
      type: 'email',
      email: 'alissa@somedomain'
    });
    // ==> Result.Ok({ name: 'Alissa', type: 'email', phone: undefined, email: 'alissa@somedomain' })


So, Results give you simpler and more predictable forms of error handling, that
still allow error propagation and composition to happen, as with regular
JavaScript exceptions, at the cost of some additional syntactical overhead,
since JavaScript does not allow one to abstract over syntax.


## Working with Result values

A Result value may be one of the following cases:

  - `Ok(value)` — represents a successful value (e.g.: the correct return value
    from a function).
    
  - `Error(value)` — represents an unsuccessful value (e.g.: an error during the
    evaluation of a function).
    
Functions that may fail just return one of these two cases instead of failing.
That is, instead of writing something like this::

    //: (Number, Number) => Number throws DivisionByZero
    const divideBy1 = (dividend, divisor) => {
      if (divisor === 0) {
        throw new Error('Division by zero');
      } else {
        return dividend / divisor;
      }
    }
    
    divideBy1(6, 3); // ==> 2
    
One would write something like this::

    const Result = require('folktale/data/result');

    //: (Number, Number) => Result DivisionByZero Number
    const divideBy2 = (dividend, divisor) => {
      if (divisor === 0) {
        return Result.Error('Division by zero');
      } else {
        return Result.Ok(dividend / divisor);
      }
    }
    
    divideBy2(6, 3); // ==> Result.Ok(2)
    
The function returns a value of the type `Result <error-type> <success-type>`,
which is quite similar to the first version of the function, with the difference
that the error is made into a real value that the function returns, and as such
can be interacted with in the same way one interacts with any other object in
the language.

Because the value is wrapped in the `Result` structure, in order to use the
value one must first unwrap it. Folktale's `Result` provides methods to help
with this, and they can be divided roughly into 3 categories:

  - **Sequencing computations**: A `Result` is the result of a computation that
    can fail. Sometimes we want to run several computations that may fail in
    sequence, and these methods help with that. This is roughly the equivalent
    of `;` in imperative programming, where the next instruction is only
    executed if the previous instruction succeeds.

  - **Transforming values**: Sometimes we get a `Result` value that isn't
    *quite* the value we're looking for. We don't really want to change the
    status of the computation (errors should continue to be errors, successes
    should continue to be successes), but we'd like to tweak the resulting
    *value* a bit. This is the equivalent of applying functions in an
    expression.

  - **Extracting values**: Sometimes we need to pass the value into things that
    don't really know what a `Result` is, so we have to somehow extract the
    value out of the structure. These methods help with that.
    
We'll see each of these categories in more details below.


### Sequencing computations

Because `Result` is used for partial functions which may fail in, possibly, many
different ways a common use case for the structure is combining all of these
functions such that only successful values flow through.

You can sequence computations in this manner with the `Result` structure by
using the `.chain` method. The method takes as argument a single function that
will receive the value in the `Result` structure, and must return a new `Result`
structure, which then becomes the result of the method. Only successful values
flow through the function argument, errors are just propagated to the result
immediately.

As an example, imagine we want to parse an integer. Integers are basically a
sequence of many digits, but we can start smaller and try figuring out how we
parse a single digit::

    const Result = require('folktale/data/result');

    const isDigit = (character) =>
      '0123456789'.split('').includes(character);

    const digit = (input) => {
      const character = input.slice(0, 1);
      const rest = input.slice(1);
      
      return isDigit(character) ?  Result.Ok([character, rest])
      :      /* otherwise */       Result.Error(`Expected a digit (0..9), got "${character}"`);
    };
    
    digit('012'); 
    // ==> Result.Ok(['0', '12'])

    digit('a12'); 
    // ==> Result.Error('Expected a digit (0..9), got "a"')
    
So far our parser correctly recognises the first digit in a sequence of
characters, but to parse integers we need it to recognise more than one digit.
We can also only proceed to the next character if the first one succeeds
(otherwise we already know it's not an integer!).

If we have a fixed number of digits that would look like the following::

    const twoDigits = (input) =>
      digit(input).chain(([char1, rest]) =>
        digit(rest).map(([char2, rest]) =>
          [char1 + char2, rest]
        )
      );

    twoDigits('012');
    // ==> Result.Ok(['01', '2'])
    
    twoDigits('a12');
    // ==> Result.Error('Expected a digit (0..9), got "a"')
    
    twoDigits('0a2');
    // ==> Result.Error('Expected a digit (0..9), got "a"')
    
We can generalise this to arbitrary numbers of digits by writing a recursive
function::

    const digits = (input) =>
      input === '' ?   Result.Error('Expected a digit (0..9), but there was nothing to parse')
    : /* otherwise */  digit(input).chain(([character, rest]) =>
                         rest === '' ?  Result.Ok(character)
                       : /* else */     digits(rest).chain(characters =>
                                          Result.Ok(character + characters)
                                        )
                       );

    digits('012');
    // ==> Result.Ok('012')
    
    digits('a12');
    // ==> Result.Error('Expected a digit (0..9), got "a"')
    
    digits('01a');
    // ==> Result.Error('Expected a digit (0..9), got "a"')
    
    digits('');
    // ==> Result.Error('Expected a digit (0..9), but there was nothing to parse')

> **NOTE**  
> While the recursive `.chain` can be used when performing an arbitrary number
> of computations, it should be noted that it may grow the stack of calls in a
> JavaScript implementation beyond what that implementation supports, resulting
> in a `Max Call Stack Size Exceeded` error.

Finally, parsing should give us a number instead of a string, so that string
needs to be converted. Since we already ensured that the resulting string only
has digits, the conversion from String to Number can never fail, but we can
still use `.chain` if we always return a `Result.Ok`::

    const integer = (input) =>
      digits(input).chain(x => Result.Ok(Number(x)));
      
    integer('012');
    // ==> Result.Ok(12)
    
    integer('01a')
    // ==> Result.Error('Expected a digit (0..9), got "a"')


### Transforming values

Sometimes we want to transform just the value that is inside of a `Result`,
without touching the context of that value (whether the `Result` is a success or
an error). In the previous section, the `integer` transformation is a good
example of this. For these cases, the `.map` method can be used instead of the
`.chain` method::

    const Result = require('folktale/data/result');

    Result.Ok('012').map(Number);
    // ==> Result.Ok(12)
    
Note that, like `.chain`, the `.map` method only runs on successful values, thus
it propagates failures as well::
    
    Result.Error('012').map(Number);
    // ==> Result.Error('012')
    
    
### Extracting values

While one can always just put all the rest of a computation inside of a
`.chain`, sometimes it may be preferrable to extract the value out of a `Result`
structure instead. For these cases there's a `.getOrElse` method::

    const Result = require('folktale/data/result');

    Result.Ok(1).getOrElse('not found');
    // ==> 1
    
    Result.Error(1).getOrElse('not found');
    // ==> 'not found'
    
Additionally, if one doesn't care about whether the value failed or succeeded,
the `.merge` method just returns whatever value is wrapped in the `Result`::

    Result.Ok(1).merge();
    // ==> 1
    
    Result.Error(1).merge();
    // ==> 1
    
    
## Error handling

Since the purpose of a `Result` structure is to represent failures, we need to
be able to handle these failures in some way. The `.getOrElse` method gives us
some very specific and limited form of error handling, but if we want to *do*
something in order to recover from an error, this doesn't help us much.

For a more general form of error handling, the `Result` structure provides the
`.orElse` method. This works pretty much in the same way `.chain` does, except
it invokes the function on errors (successes are propagated)::


    const Result = require('folktale/data/result');
    
    const parseNumber = (input) =>
      isNaN(input) ?   Result.Error(`Not a number: ${input}`) 
    : /* otherwise */  Result.Ok(Number(input));
    
    const parseBool = (input) =>
      input === 'true'  ?  Result.Ok(true)
    : input === 'false' ?  Result.Ok(false)
    : /* otherwise */      Result.Error(`Not a boolean: ${input}`);
    
    
    const parseNumberOrBool = (input) =>
      parseNumber(input)
        .orElse(_ => parseBool(input));
    

    parseNumberOrBool('13');
    // ==> Result.Ok(13)
    
    parseNumberOrBool('true');
    // ==> Result.Ok(true)
    
    parseNumberOrBool('foo');
    // ==> Result.Error('Not a boolean: foo')
    
As with successes' `.map`, one may also transform the failure value of a
`Result` without changing the context of the computation by using the
`.mapError` method::

    const parseNumberOrBool2 = (input) =>
      parseNumber(input)
        .orElse(_ => parseBool(input))
        .mapError(_ => `Not a number or boolean: ${input}`);
        
    parseNumberOrBool2('foo');
    // ==> Result.Error('Not a number or boolean: foo')
    

## Pattern matching

As with other union structures in Folktale, Result provides a `.matchWith()`
method to perform a limited form of *pattern matching*. Pattern matching allows
one to specify a piece of code for each case in a structure, like an `if/else`
or `switch`, but specific to that structure.

We could use `.matchWith()` to run different computations depending on whether a
MResult value represents a success or a failure, for example, without the
requirement of having to return a Result::

    const Result = require('folktale/data/result');
    
    Result.Ok(1).matchWith({
      Ok:    ({ value }) => `Ok: ${value}`,
      Error: ({ value }) => `Error: ${value}`
    });
    // ==> 'Ok: 1'
    
    Result.Error(1).matchWith({
      Ok:    ({ value }) => `Ok: ${value}`,
      Error: ({ value }) => `Error: ${value}`
    });
    // ==> 'Error: 1'


## How does Result compare to Validation?

Result and Validation are pretty close structures. They both try to represent
whether a particular thing has failed or succeeded, and even their vocabulary is
very similar (`Error` vs. `Failure`, `Ok` vs. `Success`). The major difference
is in some of their methods.

A Result is a data structure that implements the Monad interface (`.chain`).
This makes Result a pretty good structure to model a sequence of computations
that may fail, where a computation may only run if the previous computation
succeeded. In this sense, a Result's `.chain` method is very similar to
JavaScript's `;` at the end of statements: the statement at the right of the
semicolon only runs if the statement at the left did not throw an error.

A Validation is a data structure that implements the Applicative interface
(`.apply`), and does so in a way that if a failure is applied to another
failure, then it results in a new validation that contains the failures of both
validations. In other words, Validation is a data structure made for errors that
can be aggregated, and it makes sense in the contexts of things like form
validations, where you want to display to the user all of the fields that failed
the validation rather than just stopping at the first failure.

Validations can't be as easily used for sequencing operations because the
`.apply` method takes two validations, so the operations that create them must
have been executed already. While it is possible to use Validations in a
sequential manner, it's better to leave the job to Result, a data structure made
for that.
