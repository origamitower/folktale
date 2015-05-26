**********************
Section I: Composition
**********************

    We are about to study the idea of a computational process. Computational
    processes are abstract beings that inhabit computers. As they evolve,
    processes manipulate other abstract things called data. The evolution of a
    process is directed by a pattern of rules called a program. People create
    programs to direct processes. In effect, we conjure the spirits of the
    computer with our spells.

    — G. J. Sussman, H. Abelson and J. Sussman in Structure and Interpretation of Computer Programs

In programming we solve problems by breaking them into smaller parts, and then
putting such smaller parts back together somehow to construct the whole
solution. The same is largely true in *functional* programming. We break
problems down into smaller problems, solve them, and put them back together to
solve the large one.

Because of this, most of the emphasis in *functional* programming is in
**composition**. More concretely, functional programs try to find the right data
structures to represent the problem, and then figure out how to transform such
data structures from the original problem into the proposed solution. Given that
transformations from the problem to the solution are usually too big, functional
programs break these transformations into smaller transformations, and even
smaller transformations, and then build a big transformation by using the
smaller ones.

Transformations in functional programming are captured by, as one would probably
have guessed, *functions*. And the act of putting such functions back together
to form bigger things is called *function composition*. This section will
discuss how composition helps writing better JavaScript programs, and how one
can use the Folktale libraries for that.


