//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const define = require('folktale/helpers/define');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const Deferred = require('./_deferred');
const { Pending, Resolved, Rejected } = require('./_execution-state');
const warnDeprecation = require('folktale/helpers/warn-deprecation');



// --[ Implementation ]------------------------------------------------

/*~
 * stability: stable
 */
class Future {
  constructor() {
    define(this, '_state', Pending());
    define(this, '_listeners', []);
  }


  // ---[ State and configuration ]------------------------------------
  /*~
   * isRequired: true
   * type: |
   *   get (Future 'f 's) => ExecutionState 'f 's
   */
  get _state() {
    throw new TypeError('Future.prototype._state should be implemented in an inherited object.');
  }

  /*~
   * isRequired: true
   * type: |
   *   get (Future 'f 's) => Array (DeferredListener 'f 's)
   */
  get _listeners() {
    throw new TypeError('Future.prototype._listeners should be implemented in an inherited object.');
  }


  // ---[ Reacting to Future events ]----------------------------------
  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(DeferredListener 'f 's) => Future 'f 's
   */
  listen(pattern) {
    this._state.matchWith({
      Pending:   ()           => this._listeners.push(pattern),
      Cancelled: ()           => pattern.onCancelled(), 
      Resolved:  ({ value })  => pattern.onResolved(value),
      Rejected:  ({ reason }) => pattern.onRejected(reason)
    });
    return this;
  }


  // --[ Transforming Futures ]----------------------------------------
  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(('s) => Future 's2) => Future 'f 's2
   */
  chain(transformation) {
    let deferred = new Deferred();    // eslint-disable-line prefer-const
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onRejected:  reason => deferred.reject(reason),
      onResolved:  value  => {
        transformation(value).listen({
          onCancelled: ()     => deferred.cancel(),
          onRejected:  reason => deferred.reject(reason),
          onResolved:  value2 => deferred.resolve(value2)
        });
      }
    });

    return deferred.future();
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(('s) => 's2) => Future 'f 's2
   */
  map(transformation) {
    return this.chain(value => Future.of(transformation(value)));
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(Future 'f (('s) => 's2)) => Future 'f 's2
   */
  apply(future) {
    return this.chain(fn => future.map(fn));
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(('f) => 'f2, ('s) => 's2) => Future 'f2 's2
   */
  bimap(rejectionTransformation, successTransformation) {
    let deferred = new Deferred();      // eslint-disable-line prefer-const
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onRejected:  reason => deferred.reject(rejectionTransformation(reason)),
      onResolved:  value  => deferred.resolve(successTransformation(value))
    });

    return deferred.future();
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(('f) => 'f2) => Future 'f2 's
   */
  mapRejected(transformation) {
    return this.bimap(transformation, x => x);
  }


  // ---[ Recovering from errors ]-------------------------------------
  /*~
   * deprecated:
   *   since: 2.1.0
   *   replacedBy: .orElse(handler)
   * 
   * type: |
   *   (Future 'f 's).(('f) => Future 'f2 's2) => Future 'f2 's
   */
  recover(handler) {
    warnDeprecation('`.recover` was renamed to `.orElse` for consistency, and thus `.recover(handler)` is deprecated. Use `.orElse(handler)` instead.');
    return this.orElse(handler);
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).(('f) => Future 'f2 's2) => Future 'f2 's
   */
  orElse(handler) {
    let deferred = new Deferred();      // eslint-disable-line prefer-const
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onResolved:  value  => deferred.resolve(value),
      onRejected:  reason => {
        handler(reason).listen({
          onCancelled: ()        => deferred.cancel(),
          onResolved:  value     => deferred.resolve(value),
          onRejected:  newReason => deferred.reject(newReason)
        });
      }
    });

    return deferred.future();
  }


  /*~
   * stability: stable
   * type: |
   *   forall a, b, c, d:
   *     type Pattern = { r |
   *       Cancelled: ()  => Future c d,
   *       Resolved:  (b) => Future c d,
   *       Rejected:  (a) => Future c d
   *     }
   *     
   *     (Future a b).(Pattern) => Future c d 
   */
  willMatchWith(pattern) {
    let deferred = new Deferred();      // eslint-disable-line prefer-const
    const resolve = (handler) => (value) => handler(value).listen({
      onCancelled: ()         => deferred.cancel(),
      onResolved:  (newValue) => deferred.resolve(newValue),
      onRejected:  (reason)   => deferred.reject(reason) 
    });
    this.listen({
      onCancelled: resolve(pattern.Cancelled),
      onResolved:  resolve(pattern.Resolved),
      onRejected:  resolve(pattern.Rejected)
    });

    return deferred.future();
  }

  /*~
   * stability: stable
   * type: |
   *   (Future 'f 's).() => Future 's 'f
   */
  swap() {
    let deferred = new Deferred();    // eslint-disable-line prefer-const
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onRejected:  reason => deferred.resolve(reason),
      onResolved:  value  => deferred.reject(value) 
    });

    return deferred.future();
  }


  // ---[ Debugging ]--------------------------------------------------
  /*~
   * stability: experimental
   * type: |
   *   (Future 'f 's).() => String
   */
  toString() {
    const listeners = this._listeners.length;
    const state     = this._state;

    return `folktale:Future(${state}, ${listeners} listeners)`;
  }

  /*~
   * stability: experimental
   * type: |
   *   (Future 'f 's).() => String
   */
  inspect() {
    return this.toString();
  }


  /*~
   * stability: stable
   * type: |
   *   forall e, v:
   *     (Future e v).() => Promise v e
   */
  toPromise() {
    return require('folktale/conversions/future-to-promise')(this);
  }
}


// ---[ Constructing futures ]-----------------------------------------
Object.assign(Future, {
  /*~
   * stability: stable
   * type: |
   *   forall a, b:
   *     (Future).(b) => Future a b
   */
  of(value) {
    let result = new Future();    // eslint-disable-line prefer-const
    result._state = Resolved(value);
    return result;
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Future).(a) => Future a b
   */
  rejected(reason) {
    let result = new Future();      // eslint-disable-line prefer-const
    result._state = Rejected(reason);
    return result;
  },


  /*~
   * stability: stable
   * type: |
   *   forall e, v: (Promise v e) => Future e v
   */
  fromPromise(aPromise) {
    return require('folktale/conversions/promise-to-future')(aPromise);
  }
});


provideAliases(Future);
provideAliases(Future.prototype);


// --[ Exports ]-------------------------------------------------------
module.exports = Future;
