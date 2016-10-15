//---------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const define = require('folktale/helpers/define');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const Deferred = require('./deferred');
const { Pending, Resolved, Rejected } = require('./_execution-state');



// --[ Implementation ]------------------------------------------------

/*~
 * Represents an eventual value, like Promise, but without a recursive
 * `.then`.
 */
class Future {
  constructor() {
    define(this, '_state', Pending());
    define(this, '_listeners', []);
  }


  // ---[ State and configuration ]------------------------------------
  /*~
   * The current state of the future.
   * 
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   get (Future 'f 's) => ExecutionState 'f 's
   */
  get _state() {
    throw new TypeError('Future.prototype._state should be implemented in an inherited object.');
  }

  /*~
   * A list of listeners to notify when the future is resolved.
   * 
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   get (Future 'f 's) => Array (DeferredListener 'f 's)
   */
  get _listeners() {
    throw new TypeError('Future.prototype._listeners should be implemented in an inherited object.');
  }


  // ---[ Reacting to Future events ]----------------------------------
  /*~
   * Attaches a listener to be invoked when the Future resolves.
   * 
   * ---
   * category: Reacting to Future events
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
   * Transforms the value inside a future with a monadic function.
   * 
   * ---
   * category: Transforming futures
   * type: |
   *   (Future 'f 's).(('s) => Future 's2) => Future 'f 's2
   */
  chain(transformation) {
    let deferred = new Deferred();
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
   * Transforms the value inside a future with a simple function.
   * 
   * ---
   * category: Transforming futures
   * type: |
   *   (Future 'f 's).(('s) => 's2) => Future 'f 's2
   */
  map(transformation) {
    return this.chain(value => Future.of(transformation(value)));
  }

  /*~
   * Transforms the value inside a future with a function contained in
   * another future.
   * 
   * ---
   * category: Transforming futures
   * type: |
   *   (Future 'f 's).(Future 'f (('s) => 's2)) => Future 'f 's2
   */
  apply(future) {
    return this.chain(fn => future.map(fn));
  }

  /*~
   * Transforms successes and failures in a future.
   * 
   * ---
   * category: Transforming futures
   * type: |
   *   (Future 'f 's).(('f) => 'f2, ('s) => 's2) => Future 'f2 's2
   */
  bimap(rejectionTransformation, successTransformation) {
    let deferred = new Deferred();
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onRejected:  reason => deferred.reject(rejectionTransformation(reason)),
      onResolved:  value  => deferred.resolve(successTransformation(value))
    });

    return deferred.future();
  }

  /*~
   * Transform the values of rejected futures.
   * 
   * ---
   * category: Transforming values
   * type: |
   *   (Future 'f 's).(('f) => 'f2) => Future 'f2 's
   */
  mapRejection(transformation) {
    return this.bimap(transformation, x => x);
  }


  // ---[ Recovering from errors ]-------------------------------------
  /*~
   * Transforms a rejected future into a new future.
   * 
   * ---
   * category: Recovering from errors
   * type: |
   *   (Future 'f 's).(('f) => Future 'f2 's2) => Future 'f2 's
   */
  recover(handler) {
    let deferred = new Deferred();
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

  willMatchWith(pattern) {
    let deferred = new Deferred();
    const resolve = (handler) => (value) => handler(value).listen({
      onCancelled: ()       => deferred.cancel(),
      onResolved:  (value)  => deferred.resolve(value),
      onRejected:  (reason) => deferred.reject(reason) 
    });
    this.listen({
      onCancelled: resolve(pattern.Cancelled),
      onResolved:  resolve(pattern.Resolved),
      onRejected:  resolve(pattern.Rejected)
    });

    return deferred.future();
  }

  /*~
   * Transforms rejected futures in successes, and vice-versa.
   * 
   * ---
   * category: Recovering from errors
   * type: |
   *   (Future 'f 's).() => Future 's 'f
   */
  swap() {
    let deferred = new Deferred();
    this.listen({
      onCancelled: ()     => deferred.cancel(),
      onRejected:  reason => deferred.resolve(reason),
      onResolved:  value  => deferred.reject(value) 
    });

    return deferred.future();
  }


  // ---[ Debugging ]--------------------------------------------------
  /*~
   * Returns a textual representation of this object for debugging.
   * 
   * ---
   * category: Debugging
   * type: |
   *   (Future 'f 's).() => String
   */
  toString() {
    const listeners = this._listeners.length;
    const state     = this._state;

    return `folktale:Future(${state}, ${listeners} listeners)`;
  }

  /*~
   * Returns a textual representation of this object for Node's REPL.
   * 
   * ---
   * category: Debugging
   * type: |
   *   (Future 'f 's).() => String
   */
  inspect() {
    return this.toString();
  }
}


// ---[ Constructing futures ]-----------------------------------------
Object.assign(Future, {
  of(value) {
    let result = new Future();
    result._state = Resolved(value);
    return result;
  },

  /*~
   * Constructs a future containing a single rejected value.
   * 
   * ---
   * category: Constructing futures
   * type: |
   *   (Future).('f) => Future 'f 's
   */
  rejected(reason) {
    let result = new Future();
    result._state = Rejected(reason);
    return result;
  }
});


provideAliases(Future);
provideAliases(Future.prototype);


// --[ Exports ]-------------------------------------------------------
module.exports = Future;
