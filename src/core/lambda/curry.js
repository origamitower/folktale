//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Transforms functions of arity N into a chain of N unary functions
 * 
 * 
 * ## Example::
 * 
 *     const property = curry(2, (key, object) => object[key]);
 *     const people = [
 *       { name: 'Alissa', age: 26 },
 *       { name: 'Max',    age: 19 },
 *       { name: 'Talib',  age: 28 }
 *     ];
 * 
 *     people.map(property('name'));
 *     // ==> ['Alissa', 'Max', 'Talib']
 *
 *
 * 
 * ## What is "Currying"?
 * 
 * Currying is the process of transforming a function that takes N arguments
 * all at once, into a series of functions that take one argument at a time.
 * This makes it possible to construct new funcionality by specialising part
 * of the arguments.
 * 
 * For example, the `property` function takes two arguments: the object that
 * contains the property, and the name of the property to retrieve::
 * 
 *     const property = (object, key) => object[key];
 * 
 * Because of this, every time someone call `property` they must provide both
 * arguments::
 * 
 *     property({ greeting: 'Hi' }, 'greeting');
 *     // ==> 'Hi'
 * 
 * Some of the time, you only have some of the arguments, however. For example,
 * if you wanted to create a function that always gets the `greeting` of a
 * particular object, you would have to do so manually::
 * 
 *     const greeting = (object) => property(object, 'greeting');
 * 
 *     greeting({ greeting: 'Hi' });
 *     // ==> 'Hi'
 * 
 * Currying alleviates the need for constructing these functions manually. If
 * `property` was curried, you'd be able to create a new `greeting` function
 * by just specifying some of the arguments, like you would do when invoking
 * the function::
 * 
 *     const property2 = (key) => (object) => object[key];
 *     const greeting2 = property2('greeting');
 * 
 *     greeting({ greeting: 'Hi' });
 * 
 * Note that the way we use arguments in a curried function is slightly
 * different. When designing a function to be curried, you should consider
 * which parameters are most likely to be fixed, and which parameters will
 * be provided afterwards. In this case, it's much more likely for someone
 * to have the name of a property than it is for them to have the object
 * in which that property lives::
 * 
 *     const score = [{ type: 'win' }, { type: 'draw' }];
 *     score.map(property2('type'));
 *     // ==> ['win', 'draw']
 * 
 * 
 * ## Why Use Currying?
 * 
 * Functional programming places a heavy emphasis on function composition,
 * but sometimes we have functions that don't exactly fit the places we
 * want to use them. For example, `Array.prototype.map` expects a function
 * that takes three arguments:
 * 
 *     type Array.prototype.map =
 *       Array<'element> . (
 *         ('element, index is Number, Array<'element>) => 'newElement
 *       ) => Array<'newElement>
 * 
 * That is, given an array of of some `element` type, our callback, which
 * receives not only this `element`, but also the index of that element in
 * the array, and even the original array, is supposed to return a `newElement`
 * to put in the old element's place.
 * 
 * We can use `Array.prototype.map` to easily transform the data in the
 * array by some function. To expand a bit on the initial example, suppose
 * we have an array of people::
 * 
 *     const people = [
 *       { name: 'Alissa', age: 26, pronoun: 'she'  },
 *       { name: 'Max',    age: 19, pronoun: 'they' },
 *       { name: 'Talib',  age: 28, pronoun: 'he'   }
 *     ];
 * 
 * And then you want to get the name of one of those people. We can use
 * `Array.prototype.map` for this::
 * 
 *     people.map((element, index, array) => element.name);
 *     // ==> ['Alissa', 'Max', 'Talib']
 * 
 * 
 * > **NOTE**  
 * > Because functions in JavaScript are variadic, you don't need to
 * > create a function with three parameters here. The following code
 * > is strictly equivalent::
 * >
 * >     people.map(person => person.name);
 * >     // ==> ['Alissa', 'Max', 'Talib']
 * 
 * 
 * This is all well and good, because this is the only place where we use
 * this kind of functionality. But what if we have very similar functionality
 * in more places. For example, just like we got the names of these people,
 * we could get their ages::
 * 
 *     people.map(person => person.age);
 *     // ==> [26, 19, 28]
 * 
 * Or the pronoun they use::
 * 
 *     people.map(person => person.pronoun);
 *     // ==> ['she', 'they', 'he']
 * 
 * At this point, we're duplicating this functionality in many places. It
 * would be more productive to move it to a function we can reuse. And this
 * is easy enough:
 * 
 *     const property = (object, key) => object[key];
 * 
 * But this attempt is not really a good one in this case. Now composing
 * things is even more trouble:
 * 
 *     people.map(person => property(person, 'name'));
 * 
 * Ideally, we'd want:
 * 
 *     people.map(property);
 * 
 * But `property` takes two arguments, and `Array.prototype.map` can only
 * provide one of them: the object we should retrieve the property from.
 * Where do we get the other one from? Well, the name of the property is
 * static. We know exactly what we need from the callsite.
 * 
 * As said in the previous section, thinking about which arguments are likely
 * to be specified, and what aren't is important when designing curried
 * functions. For this case, we want to specialise the `key`, and leave
 * `object` to be provided by some other piece of code::
 * 
 *      const property = (key) => (object) => object[key];
 * 
 *      people.map(property('name'));
 *      // ==> ['Alissa', 'Max', 'Talib']
 * 
 *      people.map(property('age'));
 *      // ==> [26, 19, 28]
 * 
 *      people.map(property('pronoun'));
 *      // ==> ['she', 'they', 'he'] 
 * 
 * So, with currying, it becomes much simpler to shape a function so it
 * fits the expectations of the place where you want to use it. It alleviates
 * the need of making this translation manually, but it also requires some
 * prior thought on how these functions are likely to be used.
 * 
 * 
 * ## How Folktale's `curry` Works?
 * 
 * The `curry` operation makes it simpler to construct curried functions
 * that work well with JavaScript, where functions may, and often do, take
 * more than one argument.
 * 
 * Consider the following example::
 * 
 *     const joinedBy = (separator) => (list) => (item) =>
 *       list.concat([separator, item]);
 * 
 * It's a curried function that takes 3 arguments, one at a time. To invoke
 * it one must do so like this::
 * 
 *     joinedBy(',')(['a'])('b');
 *     // ==> ['a', ',', 'b']
 * 
 * This makes it harder to use it for functions that pass two arguments to
 * their callbacks, like `Array.prototype.reduce`, because JavaScript passes
 * them all at once:
 * 
 *     ['b'].reduce(joinedBy(','), ['a']);
 *     // ==> [<function>, <function>]
 * 
 * This is where `curry` helps. It allows you to curry functions, while
 * unrolling application of more than one argument::
 * 
 *     const joinedBy2 = curry(3, (separator, list, item) =>
 *       list.concat([separator, item]) 
 *     );
 * 
 *     joinedBy2(',', ['a'], 'b');
 *     // ==> ['a', ',', 'b']
 * 
 *     ['b'].reduce(joinedBy2(','), ['a']);
 *     // ==> ['a', ',', 'b']
 * 
 * 
 * ## `curry`, Under The Hood
 * 
 * How can `curry` construct functions that support such different styles
 * of passing arguments? The secret is in how `curry` does unrolling. A
 * function constructed by `curry` takes two arguments:
 * 
 *  1) The number of arguments that are expected for that function (arity);
 *  2) The function that should be called when those arguments are collected.
 * 
 * In return, `curry` gives you back a function that, at first, only collects
 * arguments. That is, until we reach the amount of arguments expected (arity),
 * applying the `curry`ed function gives you back a new function that you
 * continue to apply::
 * 
 *     const f = curry(4, (a, b, c, d) => [a, b, c, d]);
 * 
 *     // Previous arguments: []
 *     const f1 = f();
 *     // New arguments:      []
 * 
 *     // Previous arguments: []
 *     const f2 = f1(1);
 *     // New arguments:      [1]
 * 
 *     // Previous arguments: [1]
 *     const f3 = f2(2, 3);
 *     // New arguments:      [1, 2, 3]
 * 
 *     // Previous arguments: [1, 2, 3]
 *     f3(4);
 *     // ==> [1, 2, 3, 4]
 *     
 * The curried function keeps track of these arguments in an internal array.
 * This array is not modified when you apply a curried function. Instead, you
 * get a new function with a separate "internal arguments array"::
 * 
 *     // Previous arguments: [1]
 *     const f2_a = f2(4);  // => [1, 4]
 *     const f2_b = f2(5);  // => [1, 5]
 * 
 *     f2_a(5, 6); // ==> [1, 4, 5, 6]
 *     f2_b(5, 6); // ==> [1, 5, 5, 6]
 * 
 * Once the curried function has collected all of the arguments it needs to,
 * it "unrolls" the application. That is, it provides the arguments collected
 * to the original function::
 * 
 *     const plus  = (a, b, c) => a + b + c;
 *     const plus2 = curry(3, plus);
 * 
 *         plus2(1)(2)(3)
 *     === plus2(1, 2)(3)
 *     === plus2(1, 2, 3)
 *     === plus(1, 2, 3)
 *     === 1 + 2 + 3;
 *     
 * What happens if a curried function receives more arguments than it expects,
 * though? If the wrapped function is a regular JavaScript function, it's the
 * same. `curry` passes all of the arguments to it, and because JavaScript
 * functions are variadic, those additional arguments get (usually) ignored::
 * 
 *         plus2(1)(2)(3, 4, 5)
 *     === plus2(1, 2)(3, 4, 5)
 *     === plus2(1, 2, 3, 4, 5)
 *     === plus(1, 2, 3, 4, 5)
 *     === 1 + 2 + 3;
 * 
 * If the wrapped function is itself a curried function, things get more
 * interesting though, because the curried functio will, itself, unroll
 * the rest of the application!
 * ::
 * 
 *     const subtract = curry(2, (x, y) => x - y);
 *     const flip     = curry(3, (f, x, y) => f(y, x));
 * 
 *         subtract(1)(2)
 *     === subtract(1, 2)
 *     === 1 - 2;
 * 
 *         flip(subtract)(1)(2)
 *     === flip(subtract, 1)(2)
 *     === flip(subtract, 1, 2)
 *     === subtract(2, 1)
 *     === 2 - 1;
 * 
 * Unrolling makes it possible to compose curried functions naturally, without
 * getting in the way of regular JavaScript functions.
 * 
 * > **NOTE**  
 * > Using `curry` for real variadic functions is strongly discouraged, given
 * > that it's hard to predict which arguments will end up being provided to
 * > the variadic function.
 * 
 * 
 * ## Drawbacks of Using `curry`
 * 
 * While `curry` certainly helps composing functions, it's important to note
 * that, because a lot of functions in JavaScript are variadic, and because
 * people take advantage of this (by relying on the number of arguments
 * provided for optional parameters or overloading the signature),
 * composition of such functions is not well-defined, and `curry` makes
 * things even less predictable for these cases.
 * 
 * Because of this, the use of `curry` for variadic functions is strongly
 * discouraged.
 * 
 * One also must consider the overhead of introducing `curry` in a codebase.
 * For most code, this overhead is negligible, but `curry` should be avoided
 * in code paths that require more performance.
 * 
 * 
 * ---
 * category  : Currying and Partialisation
 * stability : experimental
 *
 * authors:
 *   - Quildreen Motta
 *
 * seeAlso:
 *   - type: link
 *     title: Does Curry Help?
 *     url: https://hughfdjackson.com/javascript/does-curry-help/
 *
 * type: |
 *   (Number, (Any...) => 'a) => Any... => 'a or ((Any...) => 'a)
 */
const curry = (arity, fn) => {
  const curried = (oldArgs) => (...newArgs) => {
    const allArgs  = oldArgs.concat(newArgs);
    const argCount = allArgs.length;

    return argCount < arity   ?  curried(allArgs)
    :      /* otherwise */       fn(...allArgs);
  };

  return curried([]);
};


module.exports = curry;
