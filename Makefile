.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs


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

clean:
	rm -rf core helpers data test/specs index.js

test: clean compile compile-test
	FOLKTALE_ASSERTIONS=minimal $(mocha) --reporter spec --ui bdd test/specs

documentation: compile
	node tools/generate-docs.js

lint:
	$(eslint) .


.PHONY: help bundle compile compile-test clean test lint documentation
