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
 * 
 * ---
 * category: Asynchronous concurrency
 * stability: experimental
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
   * ## Example::
   * 
   *     const Future = require('folktale/data/future');
   *     let result = null;
   * 
   *     Future.of(1).listen({
   *       onCancelled: ()      => { result = 'cancelled' },
   *       onResolved:  (value) => { result = `resolved: ${value}` },
   *       onRejected:  (value) => { result = `rejected: ${value}` }
   *     });
   * 
   *     result; // ==> 'resolved: 1'
   * 
   * ---
   * category: Reacting to Future events
   * stability: experimental
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
   * Transforms resolved futures into new futures.
   * 
   * ## Example::
   * 
   *     const Future = require('folktale/data/future');
   * 
   *     Future.of(1).chain(x => Future.of(x + 1));        // => Future.of(2)
   *     Future.rejected(1).chain(x => Future.of(x + 1));  // => Future.rejected(1)
   * 
   * ---
   * category: Transforming futures
   * stability: experimental
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
   * Transforms the value inside of a resolved future.
   * 
   * ## Example::
   * 
   *     const Future = require('folktale/data/future');
   * 
   *     Future.of(1).map(x => x + 1);        // => Future.of(2)
   *     Future.rejected(1).map(x => x + 1);  // => Future.rejected(1)
   * 
   * ---
   * category: Transforming futures
   * stability: experimental
   * type: |
   *   (Future 'f 's).(('s) => 's2) => Future 'f 's2
   */
  map(transformation) {
    return this.chain(value => Future.of(transformation(value)));
  }

  /*~
   * Applies a function contained in the future to the value of another future.
   * 
   * ## Example::
   * 
   *     const Future = require('folktale/data/future');
   * 
   *     const inc = (x) => x + 1;
   * 
   *     Future.of(inc).apply(Future.of(1));        // => Future.of(2)
   *     Future.of(inc).apply(Future.rejected(1));  // => Future.rejected(1)
   *     Future.rejected(inc).apply(Future.of(1));  // => Future.rejected(inc)  
   * 
   * ---
   * category: Transforming futures
   * stability: experimental
   * type: |
   *   (Future 'f 's).(Future 'f (('s) => 's2)) => Future 'f 's2
   */
  apply(future) {
    return this.chain(fn => future.map(fn));
  }

  /*~
   * Transforms the rejection or success of a future.
   * 
   * ## Example::
   * 
   *     const Future = require('folktale/data/future');
   * 
   *     const inc = (x) => x + 1;
   *     const dec = (x) => x - 1;
   * 
   *     Future.of(1).bimap(inc, dec);        // => Future.of(dec(1))
   *     Future.rejected(1).bimap(inc, dec);  // => Future.rejected(inc(1))
   * 
   * ---
   * category: Transforming futures
   * stability: experimental
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
   * ## Example::
   * 
   *     const { of, rejected } = require('folktale/data/future');
   * 
   *     of(1).mapRejection(x => x + 1);        // => of(1)
   *     rejected(1).mapRejection(x => x + 1);  // => rejected(2)
   * 
   * ---
   * category: Transforming values
   * stability: experimental
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
   * ## Example::
   * 
   *     const { of, rejected } = require('folktale/data/future');
   * 
   *     of(1).recover(x => of(x + 1));             // => of(1)
   *     rejected(1).recover(x => of(x + 1));       // => of(2)
   *     rejected(1).recover(x => rejected(x + 1)); // => rejected(2)
   * 
   * ---
   * category: Recovering from errors
   * stability: experimental
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


  /*~
   * Returns a future that eventually transforms its state by invoking
   * a function for that state. The function must return a new Future.
   * 
   * ## Example::
   * 
   *     const { of, rejected } = require('folktale/data/future');
   * 
   *     const pattern = {
   *       Cancelled: ()      => of('cancelled'),
   *       Resolved:  (value) => of(`resolved: ${value}`),
   *       Rejected:  (value) => of(`rejected: ${value}`)
   *     };
   * 
   *     of(1).willMatchWith(pattern);        // => of('resolved: 1')
   *     rejected(1).willMatchWith(pattern);  // => of('rejected: 1')
   *  
   * ---
   * category: Pattern matching
   * stability: experimental
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
   * ## Example::
   * 
   *     const { of, rejected } = require('folktale/data/future');
   * 
   *     of(1).swap();         // => rejected(1)
   *     rejected(1).swap();   // => of(1)
   * 
   * ---
   * category: Recovering from errors
   * stability: experimental
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
   * ## Example::
   * 
   *     const { of, rejected } = require('folktale/data/future');
   * 
   *     of(1).toString(); 
   *     // ==> 'folktale:Future(Resolved(1), 0 listeners)'
   *     
   *     rejected(1).toString();
   *     // ==> 'folktale:Future(Rejected(1), 0 listeners)'
   * 
   * ---
   * category: Debugging
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
   * Returns a textual representation of this object for Node's REPL.
   * 
   * ---
   * category: Debugging
   * stability: experimental
   * type: |
   *   (Future 'f 's).() => String
   */
  inspect() {
    return this.toString();
  }
}


// ---[ Constructing futures ]-----------------------------------------
Object.assign(Future, {
  /*~
   * Constructs a future containing a successful value.
   * 
   * ---
   * category: Constructing futures
   * stability: experimental
   * type: |
   *   forall a, b:
   *     (Future).(b) => Future a b
   */
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
   * stability: experimental
   * type: |
   *   forall a, b: (Future).(a) => Future a b
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
