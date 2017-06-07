@guide: Development tasks and tooling
category: 4. Annexes
authors:
  - "@robotlolita"
---

[Folktale uses GNU Make for development tooling](guides.setting-up-a-development-environment.html). From
there you can compile the source code, run tests, perform cleanup routines, or
check your source code for style errors.

Note: **before you can do anything in Folktale you must initialise the documentation tools**:

```shell
$ git submodule init
$ git submmodule update
$ make tools
```

Running `make` or `make help` will show you all of the available development
tasks.

Running `make compile` will compile the source code using Babel. 
After this you can import the objects in the REPL and interact with them.

Running `make compile-annotated` will compile the source code with the special documentation
marks. You can either use `make documentation` to generate HTML docs from that, or
`require('./documentation')` in a Node REPL to read the docs from there.

Running `make test` will compile the project and run all of the tests. Running
`make test-all` will also test the examples in the documentation. You can run
tests in a PhantomJS (a headless WebKit browser) using `make test-browser`.

Running `make lint` will check all of the source code for style
inconsistencies. The coding style used by Folktale is described later in this
document.

Finally, running `make clean` will remove any compiled files from your working
directory, but will keep all other files intact. You can always run `make
compile` again to re-build the project.
