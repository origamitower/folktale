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
    // ==> Failure(['Password must have more than 6 characters', 'Password must contain a special character.'])

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
    // ==> ['Password must have more than 6 characters', 'Password must contain a special character']


    validateForm({
      name: 'Alissa',
      password: 'roses$are$red'
    });
    // ==> []

Because this function uses `if` conditions and modifies a local variable it's not very modular. This means it's not possible to split these checks in smaller pieces that can be entirely understood by themselves — they modify something, and so you have to understand how they modify that thing, in which context, etc. For very simple things it's not too bad, but as complexity grows it becomes unmanageable.

You can manage this complexity by designing a special function for verifying if an object passes some tests. This is common in validation libraries (like [jquery-validation](https://jqueryvalidation.org/)) and schema libraries (like [jsonschema](https://www.npmjs.com/package/jsonschema)), but they're ultimately incompatible with other validation routines, and uncomposable::

    const validators = {
      notEmpty(object, { property }) {
        return object[property].trim() ?  [`${property} can't be empty']
        :      /* else */                 [];
      },

      minLength(object, { property, min }) {
        const value = object[property]
        return value.length < min ?  [`${property} should be at least ${min} characters']
        :      /* else */            [];
      },

      regexp(object, { property, regexp, message }) {
        return !regex.test(object[property]) ?  [message]
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
          message: 'Password must contain a special character'
        }
      ]);
    }
    
    validateForm2({
      name: '',
      password: 'roses$are$red'
    });
    // ==> ['Name is required']

    validateForm2({
      name: 'Alissa',
      password: 'alis'
    });
    // ==> ['Password must have more than 6 characters', 'Password must contain a special character']

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
    : /* else */       Failure([`${field} can't be empty']);

    const minLength = (field, min, value) =>
      value.length > min ?   Success(value)
    : /* otherwise */        Failure(['${field} must have more than ${min} characters.']);

    const matches = (field, regexp, value, message = '') =>
      regexp.test(value) ?  Success(value)
    : /* otherwise */       Failure([message || '${field} must match ${regexp}']);

    const isPasswordValid = (password) =>
      Success().concat(minLength('password', password))
               .concat(matches('password', /\W/))
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
    // ==> Failure(['name is required'])

    validateForm3({
      name: 'Alissa',
      password: 'alis'
    });
    // ==> Failure(['password must have more than 6 characters', 'password must contain a special character'])


    validateForm3({
      name: 'Alissa',
      password: 'roses$are$red'
    });
    // => Success({ name: 'Alissa', password: 'roses$are$red' })
