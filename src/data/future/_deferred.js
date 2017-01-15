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
const thunk  = require('folktale/helpers/thunk');

const Future = thunk(_ => require('./_future'));
const { Pending, Cancelled, Rejected, Resolved } = require('./_execution-state');


// --[ Helpers ]-------------------------------------------------------

/*~
 * Moves a deferred to a resolved state.
 * ---
 * type: |
 *   ('a: Deferred 'f 's, ExecutionState 'f 's) => Void :: mutates 'a
 */
const moveToState = (deferred, newState) => {
  if (!Pending.hasInstance(deferred._state)) {
    const description = newState.matchWith({
      Resolved:  _ => 'resolved',
      Rejected:  _ => 'rejected',
      Cancelled: _ => 'cancelled'
    });
    throw new Error(`Only pending deferreds can be ${description}, this deferred is already ${description}.`);
  }

  deferred._state = newState;

  const listeners = deferred._listeners;
  for (let i = 0; i < listeners.length; ++i) {
    newState.matchWith({
      Resolved: ({ value })  => listeners[i].onResolved(value),
      Rejected: ({ reason }) => listeners[i].onRejected(reason),
      Cancelled: _           => listeners[i].onCancelled()
    });
  }
  deferred._listeners = [];
};


// --[ Implementation ]------------------------------------------------
/*~
 * Deferreds allow creating containers for eventual values.
 * 
 * A deferred is a low-level structure to construct containers of
 * eventual values, and fill them with a value at a later point in
 * time. Most uses of deferred are better addressed by the `Task`
 * object.
 * 
 * ## Example::
 * 
 *     const delay = (ms) => {
 *       const deferred = new Deferred();
 *       setTimeout(() => deferred.resolve(), ms);
 *       return deferred.promise();
 *     };
 * 
 *     delay(100).then(() => {
 *       // do something after 100 ms
 *     });
 * 
 * 
 * ## Why not use Deferreds?
 * 
 * As mentioned above, a deferred is a low-level structure. While
 * it does allow cancellation and converting to a higher-level
 * structure (like Future or Promise), it does not provide important
 * facilities for asynchronous concurrency, like resource handling.
 * 
 * In this sense, a Task provides a simpler interface and more
 * guarantees for processes that must allocate resources and
 * collect them afterwards. For example, a cancellable delay
 * would look like this with a Task::
 * 
 *     const { task } = require('folktale/data/task');
 *     
 *     const delay = (ms) => task(resolver => {
 *       return setTimeout(() => resolver.resolve(), ms);
 *     }, {
 *       onCancelled: (timer) => { clearTimeout(timer) }
 *     });
 * 
 *     const execution = delay(100).run();
 *     execution.promise().then(() => {
 *       // do something after 100 ms
 *     });
 *     execution.cancel(); // cancels the execution and collects the timer
 * 
 */
function Deferred() {
  define(this, '_state', Pending());
  define(this, '_listeners', []);
}


Deferred.prototype = {
  // ---[ State and configuration ]------------------------------------
  /*~
   * The current state of the deferred.
   * 
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   get (Deferred 'f 's) => ExecutionState 'f 's
   */
  get _state() {
    throw new TypeError('Deferred.prototype is abstract and does not implement ._state.');
  },

  /*~
   * A list of functions to notify of state transitions in this deferred.
   * 
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   get (Deferred 'f 's) => Array (DeferredListener 'f 's)
   */
  get _listeners() {
    throw new TypeError('Deferred.prototype is abstract and does not implement ._listeners');
  },


  // ---[ Resolving a deferred ]---------------------------------------
  /*~
   * Resolves a deferred with a successful value.
   * 
   * ---
   * category: Resolving a deferred
   * type: |
   *   ('a: Deferred 'f 's).('s) => 'a :: mutates 'a
   */
  resolve(value) {
    moveToState(this, Resolved(value));
    return this;
  },

  /*~
   * Resolves a deferred with a failure.
   * 
   * ---
   * category: Resolving a deferred
   * type: |
   *   ('a: Deferred 'f 's).('f) => 'a :: mutates 'a
   */
  reject(reason) {
    moveToState(this, Rejected(reason));
    return this;
  },

  /*~
   * Resolves a deferred with a cancellation.
   * 
   * ---
   * category: Resolving a deferred
   * type: |
   *   ('a: Deferred 'f 's).() => 'a :: mutates 'a
   */
  cancel() {
    moveToState(this, Cancelled());
    return this;
  },

  maybeCancel() {
    if (Pending.hasInstance(this._state)) {
      this.cancel();
    }
    return this;
  },


  // ---[ Reacting to events in a deferred ]---------------------------
  /*~
   * Attaches a listener to be notified when the deferred resovles.
   * 
   * ---
   * category: Reacting to events in a deferred
   * type: |
   *   ('a: Deferred 'f 's).(DeferredListener 'f 's) => Void
   */
  listen(pattern) {
    this._state.matchWith({
      Pending:   _            => this._listeners.push(pattern),
      Cancelled: _            => pattern.onCancelled(), 
      Resolved:  ({ value })  => pattern.onResolved(value),
      Rejected:  ({ reason }) => pattern.onRejected(reason)
    });
    return this;
  },


  // ---[ Working with deferred values ]-------------------------------
  /*~
   * Returns the eventual value of a deferred as a promise.
   * 
   * ---
   * category: Working with deferred values
   * type: |
   *   (Deferred 'f 's).() => Promise 'f 's
   */
  promise() {
    return new Promise((resolve, reject) => {
      this.listen({
        onCancelled: _ => reject(Cancelled()),
        onResolved: resolve,
        onRejected: reject 
      });
    });
  },

  /*~
   * Returns the eventual value of a deferred as a future.
   * 
   * ---
   * category: Working with deferred values
   * type: |
   *   (Deferred 'f 's).() => Future 'f 's
   */
  future() {
    let future = new (Future());
    this.listen({
      onCancelled: _      => moveToState(future, Cancelled()),
      onRejected:  reason => moveToState(future, Rejected(reason)),
      onResolved:  value  => moveToState(future, Resolved(value)) 
    });

    return future;
  },

  // ---[ Debugging ]--------------------------------------------------
  /*~
   * Returns a textual representation of this object for debugging.
   * 
   * ---
   * category: Debugging
   * type: |
   *   (Deferred 'f 's).() => String
   */
  toString() {
    const listeners = this._listeners.length;
    const state     = this._state;

    return `folktale:Deferred(${state}, ${listeners} listeners)`;
  },

  /*~
   * Returns a textual representation of this object for Node's REPL.
   * 
   * ---
   * category: Debugging
   * type: |
   *   (Deferred 'f 's).() => String
   */
  inspect() {
    return this.toString();
  },

  [Symbol.toStringTag]: 'folktale:Deferred'  
};


// --[ Exports ]-------------------------------------------------------
module.exports = Deferred;
