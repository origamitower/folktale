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
   *   ('a: Deferred 'f 's).('s) => Void :: mutates 'a
   */
  resolve(value) {
    moveToState(this, Resolved(value));
  },

  /*~
   * Resolves a deferred with a failure.
   * 
   * ---
   * category: Resolving a deferred
   * type: |
   *   ('a: Deferred 'f 's).('f) => Void :: mutates 'a
   */
  reject(reason) {
    moveToState(this, Rejected(reason));
  },

  /*~
   * Resolves a deferred with a cancellation.
   * 
   * ---
   * category: Resolving a deferred
   * type: |
   *   ('a: Deferred 'f 's).() => Void :: mutates 'a
   */
  cancel() {
    moveToState(this, Cancelled());
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
