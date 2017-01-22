//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assertType = require('folktale/helpers/assert-type');
const assertFunction = require('folktale/helpers/assert-function');
const { data, setoid, show } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const constant = require('folktale/core/lambda/constant');
const adtMethods = require('folktale/helpers/define-adt-methods');


const Validation = data('folktale:Data.Validation', {
  Failure(value) { 
    return { value };
  },
  Success(value) { 
    return { value };
  }
}).derive(setoid, show);

const { Success, Failure } = Validation;
const assertValidation = assertType(Validation);


adtMethods(Validation, {
  map: {
    Failure(transformation) {
      assertFunction('Validation.Failure#map', transformation);
      return this;
    },

    Success(transformation) {
      assertFunction('Validation.Success#map', transformation);
      return Success(transformation(this.value));
    }
  },


  apply: {
    Failure(aValidation) {
      assertValidation('Failure#apply', aValidation);
      return Failure.hasInstance(aValidation) ? Failure(this.value.concat(aValidation.value))
      :      /* otherwise */                    this;
    },

    Success(aValidation) {
      assertValidation('Success#apply', aValidation);
        return Failure.hasInstance(aValidation) ? aValidation
        :      /* otherwise */                    aValidation.map(this.value);
    }
  },


  unsafeGet: {
    Failure() {
      throw new TypeError(`Can't extract the value of a Failure.

    Failure does not contain a normal value - it contains an error.
    You might consider switching from Validation#get to Validation#getOrElse, or some other method
    that is not partial.
      `);
    },

    Success() {
      return this.value;
    }
  },


  getOrElse: {
    Failure(default_) {
      return default_;
    },

    Success(default_) {
      return this.value;
    }
  },


  orElse: {
    Failure(handler) {
      assertFunction('Validation.Failure#orElse', handler);
      return handler(this.value);
    },

    Success(handler) {
      assertFunction('Validation.Success#orElse', handler);
      return this;
    }
  },


  concat: {
    Failure(aValidation) {
      assertValidation('Validation.Failure#concat', aValidation);
      if (Failure.hasInstance(aValidation)) {
        return Failure(this.value.concat(aValidation.value));
      } else {
        return this;
      }
    },

    Success(aValidation) {
      assertValidation('Validation.Success#concat', aValidation);
      return aValidation;
    }
  },


  fold: {
    Failure(failureTransformation, successTransformation) {
      assertFunction('Validation.Failure#fold', failureTransformation);
      assertFunction('Validation.Failure#fold', successTransformation);
      return failureTransformation(this.value);
    },

    Success(failureTransformation, successTransformation) {
      assertFunction('Validation.Success#fold', failureTransformation);
      assertFunction('Validation.Success#fold', successTransformation);
      return successTransformation(this.value);
    }
  },


  swap: {
    Failure() {
      return Success(this.value);
    },

    Success() {
      return Failure(this.value);
    }
  },


  bimap: {
    Failure(failureTransformation, successTransformation) {
      assertFunction('Validation.Failure#fold', failureTransformation);
      assertFunction('Validation.Failure#fold', successTransformation);
      return Failure(failureTransformation(this.value));
    },

    Success(failureTransformation, successTransformation) {
      assertFunction('Validation.Success#fold', failureTransformation);
      assertFunction('Validation.Success#fold', successTransformation);
      return Success(successTransformation(this.value));
    }
  },


  failureMap: {
    Failure(transformation) {
      assertFunction('Validation.Failure#failureMap', transformation);
      return Failure(transformation(this.value));
    },

    Success(transformation) {
      assertFunction('Validation.Failure#failureMap', transformation);
      return this;
    }
  },

  cata: {
    Failure(pattern) {
      warnDeprecation('`.cata(pattern)` is deprecated. Use `.matchWith(pattern)` instead.');
      return pattern.Failure(this.value);
    },

    Success(pattern) {
      warnDeprecation('`.cata(pattern)` is deprecated. Use `.matchWith(pattern)` instead.');
      return pattern.Success(this.value);
    }
  }
});


Object.assign(Validation, {
  of(value) {
    return Success(value);
  },

  'get'() {
    warnDeprecation('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },

  merge() {
    return this.value;
  },

  toResult() {
    return require('folktale/data/conversions/validation-to-result')(this);
  },

  toMaybe() {
    return require('folktale/data/conversions/validation-to-maybe')(this);
  }
});


provideAliases(Success.prototype);
provideAliases(Failure.prototype);
provideAliases(Validation);

module.exports = Validation;
