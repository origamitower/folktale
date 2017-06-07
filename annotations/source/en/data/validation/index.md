@annotate: folktale.data.validation
category: Handling failures
---

A data structure that typically models form validations, and other scenarios where
you want to aggregate **all** failures, rather than short-circuit if an error
happens (for which `Result` is better suited).

A `Validation` may either be a `Success(value)`, which contains a successful value,
or a `Failure(value)`, which contains an error.


## Example::

    const Validation = require('folktale/data/validation');
    const { Success, Failure } = Validation;

    const isPasswordLongEnough = (password) =>
      password.length > 6 ?   Success(password)
    : /* otherwise */         Failure(['Password must have more than 6 characters.']);

    const isPasswordStrongEnough = (password) =>
      /[\W]/.test(password) ?  Success(password)
    : /* otherwise */          Failure(['Password must contain a special character.']);

    const isPasswordValid = (password) =>
      Success().concat(isPasswordLongEnough(password))
               .concat(isPasswordStrongEnough(password))
               .map(_ => password);

    isPasswordValid('foo');
    // ==> Failure(['Password must have more than 6 characters.', 'Password must contain a special character.'])

    isPasswordValid('rosesarered');
    // ==> Failure(['Password must contain a special character.'])

    isPasswordValid('rosesarered$andstuff')
    // ==> Success('rosesarered$andstuff')


## Why use Validation?

Things like form and schema validation are pretty common in programming, but we end up either using branching or designing very specific solutions for each case.

With branching, things get quickly out of hand, because it's difficult to abstract over it, and it's thus difficult to understand the resulting program::

    function validateForm(data) {
      const errors = [];
      
      if (!data.name.trim()) {
        errors.push('Name is required');
      }
      if (data.password.length < 6) {
        errors.push('Password must have at least 6 characters');
      }
      if (!/\W/.test(data.password)) {
        errors.push('Password must contain a special character');
      }

      return errors;
    }

    validateForm({
      name: '',
      password: 'roses$are$red'
    });
    // ==> ['Name is required']

    validateForm({
      name: 'Alissa',
      password: 'alis'
    });
    // ==> ['Password must have at least 6 characters', 'Password must contain a special character']


    validateForm({
      name: 'Alissa',
      password: 'roses$are$red'
    });
    // ==> []

Because this function uses `if` conditions and modifies a local variable it's not very modular. This means it's not possible to split these checks in smaller pieces that can be entirely understood by themselves — they modify something, and so you have to understand how they modify that thing, in which context, etc. For very simple things it's not too bad, but as complexity grows it becomes unmanageable.

You can manage this complexity by designing a special function for verifying if an object passes some tests. This is common in validation libraries (like [jquery-validation](https://jqueryvalidation.org/)) and schema libraries (like [jsonschema](https://www.npmjs.com/package/jsonschema)), but they're ultimately incompatible with other validation routines, and uncomposable::

    const validators = {
      notEmpty(object, { property }) {
        return !object[property].trim() ?  [`${property} can't be empty`]
        :      /* else */                  [];
      },

      minLength(object, { property, min }) {
        const value = object[property];
        return value.length < min ?  [`${property} must have at least ${min} characters`]
        :      /* else */            [];
      },

      regexp(object, { property, regexp, message }) {
        return !regexp.test(object[property]) ?  [message]
        :      /* else */                       [];
      }
    };

    const validate = (rules) => (object) =>
      rules.reduce((result, rule) => 
        [...result, ...validators[rule.rule](object, rule)], 
        []
      );

    function validateForm2(data) {
      return validate([
        {
          rule: 'notEmpty',
          property: 'name'
        },
        {
          rule: 'minLength',
          property: 'password',
          min: 6
        },
        {
          rule: 'regexp',
          property: 'password',
          regexp: /\W/,
          message: 'password must contain a special character'
        }
      ])(data);
    }
    
    validateForm2({
      name: '',
      password: 'roses$are$red'
    });
    // ==> ['name can\'t be empty']

    validateForm2({
      name: 'Alissa',
      password: 'alis'
    });
    // ==> ['password must have at least 6 characters', 'password must contain a special character']

    validateForm2({
      name: 'Alissa',
      password: 'roses$are$red'
    });
    // ==> []

Now, while you can understand validations on their own, and share validations between different methods (if they fit the specific use case of the validation library), it's hard to extend it to support new validations (as you can't reuse existing validations), and it's hard to compose validations, because the library defines its own little language for that.

Neither of those are very compelling. The Validation structure gives you a tool for basing validation libraries and functions on in a way that's reusable and composable::

    const Validation = require('folktale/data/validation');
    const { Success, Failure } = Validation;

    const notEmpty = (field, value) =>
      value.trim() ?   Success(field)
    : /* else */       Failure([`${field} can't be empty`]);

    const minLength = (field, min, value) =>
      value.length > min ?   Success(value)
    : /* otherwise */        Failure([`${field} must have at least ${min} characters`]);

    const matches = (field, regexp, value, message = '') =>
      regexp.test(value) ?  Success(value)
    : /* otherwise */       Failure([message || `${field} must match ${regexp}`]);

    const isPasswordValid = (password) =>
      Success().concat(minLength('password', 6, password))
               .concat(matches('password', /\W/, password, 'password must contain a special character'))
               .map(_ => password);

    const isNameValid = (name) =>
      notEmpty('name', name);

    const validateForm3 = (data) =>
      Success().concat(isPasswordValid(data.password))
               .concat(isNameValid(data.name))
               .map(_ => data);

    validateForm3({
      name: '',
      password: 'roses$are$red'
    });
    // ==> Failure(['name can\'t be empty'])

    validateForm3({
      name: 'Alissa',
      password: 'alis'
    });
    // ==> Failure(['password must have at least 6 characters', 'password must contain a special character'])


    validateForm3({
      name: 'Alissa',
      password: 'roses$are$red'
    });
    // ==> Success({ name: 'Alissa', password: 'roses$are$red' })


## Working with Validation values

A validation m ay be one of the following cases:

  - `Success(value)` — represents a successful value (e.g.: the result of passing a validator);
  - `Failure(value)` — represents an unsuccessful value (e.g.: the result of failing a validation rule);

Validation functions just return one of these two cases instead of throwing errors or mutating other variables. Working with Validation values typically falls into one of the following categories:

  - **Combining validations**: Sometimes we want to create more complex validation rules that reuse simpler ones. These functions let us take the result of those rules and put them together into a single Validation value.

  - **Transforming values**: Sometimes we get a `Validation` value that isn't quite what we're looking for. We don't really want to change anything about the status of the validation (whether it passed or failed), but we'd like to tweak the *value* a little bit. This is the equivalent of applying functions in an expression.

  - **Reacting to results**: Once we have a Validation value, we must be able to run pieces of code depending on whether the validation succeeded or failed, with access to the failure reason in the later case.

We'll see each of these categories in more details below.


### Combining validations

Combining validations is the most common thing to do with the Validation structure once you have some more complex validations in place. There are a few options that may be more or less convenient for you.

The simplest way of combining validations is through the `.concat` method. When concatenating validations, failures are themselves concatenated, but concatenating two successes just yields the latter one::

    const { Success, Failure } = require('folktale/data/validation');

    Failure('a').concat(Failure('b'));
    // ==> Failure('ab')

    Failure('a').concat(Success('b'));
    // ==> Failure('a')

    Success('a').concat(Success('b'));
    // ==> Success('b')

If you have a constructor for a data structure that can be curried, it's often more convenient to use the `.apply` method instead::

    const curry = require('folktale/core/lambda/curry');

    const Language = (name, compiler) => ({ name, compiler });

    Success(curry(2, Language))
      .apply(Success('Rust'))
      .apply(Success('rustc'));
    // ==> Success({ name: 'Rust', compiler: 'rustc' })

Finally, if you have an array of validations, it's convenient to use the module-level `collect` function::

    const { collect } = require('folktale/data/validation');

    collect([Failure('a'), Failure('b'), Success('c')]);
    // ==> Failure('ab')

`collect` uses `.concat` internally, so you end up with the last success if all validations succeed::

    collect([Success('a'), Success('b')]);
    // ==> Success('b')


### Transforming values

It's usually more convenient to use `.apply` when possible to get transformed values in one go, but sometimes you want to discard some of the values, or you may not know how many values you're getting in the validation. Sometimes you don't even want any of the success values in your resulting structure. For all of these cases, `.apply` makes less sense, and you have to transform the result after combining the validations. That's what `.map` is for::

    const { Success, Failure } = require('folktale/data/validation');

    Success(1).map(x => x + 1);
    // ==> Success(2)

    Failure('a').map(x => x + 1);
    // ==> Failure('a')

    Success(1).concat(Success(2)).map(_ => 'hello');
    // ==> Success('hello')

It's also possible to transform the failure values through the `.mapFailure` function::

    Failure('a').mapFailure(x => x.toUpperCase());
    // ==> Failure('A')

    Success('a').mapFailure(x => x.toUpperCase());
    // ==> Success('a')


### Reacting to results

Once you've combined all of the validations, you usually want to see if the overall validation succeeded or failed, and then take the appropriate path in your code for each case. The `.matchWith` function helps with this. `.matchWith` is a function provided for every union structure in Foltkale, and it lets you select a piece of code to run based on how the value you're interacting with is tagged. In the case of Validations, it lets you select a piece of code for failures, and a piece of code for successes::

    const { Success, Failure } = require('folktale/data/validation');

    Success(1).matchWith({
      Success: ({ value }) => `Success: ${value}`,
      Failure: ({ value }) => `Failure: ${value}`
    });
    // ==> 'Success: 1'

    Failure(1).matchWith({
      Success: ({ value }) => `Success: ${value}`,
      Failure: ({ value }) => `Failure: ${value}`
    });
    // ==> 'Failure: 1'


## How does Validation compare to Result?

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
