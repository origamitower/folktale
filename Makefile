.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs
karma      := $(bin)/karma


# -- [ COMPILATION ] ---------------------------------------------------
node_modules: package.json
	npm install


# -- [ TASKS ] ---------------------------------------------------------
help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  bundle ................. Generates a Browser bundle of Folktale."
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  test-browser ........... Runs the tests in PhantomJS."
	@echo "  test-sauce ............. Runs the tests in SauceLabs (requires sauceconnect + env vars)."
	@echo "  lint ................... Lints all source files."
	@echo "  documentation .......... Builds the documentation from source."
	@echo ""

bundle:
	mkdir -p dist
	$(browserify) index.js --standalone folktale > dist/folktale.js
	$(uglify) --mangle - < dist/folktale.js > dist/folktale.min.js

compile:
	$(babel) src --source-map inline --out-dir .

compile-test:
	$(babel) test/specs-src --source-map inline --out-dir test/specs
	$(babel) test/helpers-src --source-map inline --out-dir test/helpers
	$(browserify) test/browser/browser-tests.js --source-map inline > test/browser/tests.js

clean:
	rm -rf core helpers data test/specs test/helpers index.js

test: clean compile compile-test
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd test/specs

test-minimal:
	FOLKTALE_ASSERTIONS=none $(mocha) --require babel-polyfill --reporter dot --ui bdd test/specs

test-browser: compile compile-test
	$(karma) start test/karma-local.js

test-sauce: compile compile-test
	$(karma) start test/karma-sauce.js

all-tests:
	$(MAKE) test
	$(karma) start test/karma-local.js

documentation: compile
	node tools/generate-docs.js

lint:
	$(eslint) .


.PHONY: help bundle compile compile-test clean test lint documentation test-minimal test-browser test-sauce all-tests
