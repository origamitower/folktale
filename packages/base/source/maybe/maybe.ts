//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

import { Setoid, Semigroup, Monoid, Functor, Applicative, Monad } from '../typings/interfaces'
import { withFantasyLand } from '../helpers/fantasy-land'


type MaybeTag = 'Just' | 'Nothing';


/**
 * A structure to represent values that may or may not be present.
 * 
 * @stability stable
 */
@withFantasyLand
abstract class Maybe<A> 
implements 
  Setoid<A>,
  Semigroup<A>, 
  Monoid<A>,
  Functor<A>,
  Applicative<A>,
  Monad<A>
{
  // -- Folktale and TypeScript metadata ------------------------------
  /**
   * A unique identifier for this type.
   */
  '@@folktale/type': 'folktale/maybe' = 'folktale/maybe';

  /**
   * A tag that uniquely identifies a variant of this type.
   */
  abstract '@@folktale/tag': MaybeTag;

  /**
   * The type parameter so we can distinguish two maybes with structural typing.
   */
  '@@folktale/type/0': A;


  // -- Interface implementations -------------------------------------
  /**
   * Tests if two Maybe instances are structurally equal.
   * 
   * @param this -- left operand
   * @param that -- right operand
   */
  abstract equals(this: Maybe<A>, that: Maybe<A>): boolean;

  /**
   * Concatenates the values inside of a Maybe, if both instances are `Just`.
   * 
   * > **NOTE**
   * > The contents of each `Just` instance must be a semigroup.
   * 
   * @param this -- left operand
   * @param that -- right operand
   */
  abstract concat<A, S extends Semigroup<A>>(this: Maybe<S>, that: Maybe<S>): Maybe<S>;

  /**
   * Constructs a new Maybe without a value (a `Nothing`).
   * 
   * @param this -- the maybe instance
   */
  abstract empty(this: Maybe<A>): Maybe<A>;

  /**
   * Transforms the value inside of the maybe without changing the context of the value.
   * 
   * @param this -- the maybe instance to transform
   * @param transformation -- a way of transforming the value inside of the maybe.
   */
  abstract map<B>(this: Maybe<A>, transformation: (value: A) => B): Maybe<B>;

  /**
   * Transforms the value inside of a Maybe with a function stored in another maybe.
   * 
   * @param this -- a maybe instance containing a transformation
   * @param that -- a maybe instance with a value to be transformed
   */
  abstract apply<B>(this: Maybe<(value: A) => B>, that: Maybe<A>): Maybe<B>;

  /**
   * Constructs a new maybe instance that contains exactly the given value.
   * 
   * @param this -- a maybe type
   * @param value -- the value to store in the maybe instance
   */
  abstract of<B>(this: Maybe<A>, value: B): Maybe<B>;

  /**
   * Transforms the value inside of a Maybe along with its context.
   * 
   * @param this -- a maybe instance to transform
   * @param transformation -- a transformation that returns a new Maybe instance
   */
  abstract chain<B>(this: Maybe<A>, transformation: (value: A) => Maybe<B>): Maybe<B>;
}


class Just<A> extends Maybe<A> {
  '@@folktale/tag': MaybeTag = 'Just'

  constructor(readonly value: A) {
    super();
  }
}


class Nothing<A> extends Maybe<A> {
  '@@folktale/tag': MaybeTag = 'Nothing'

  constructor(readonly value: A) {
    super();
  }
}