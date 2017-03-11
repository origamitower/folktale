.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs
karma      := $(bin)/karma


# -- [ CONFIGURATION ]--------------------------------------------------
DOCS_SRC_DIR := docs/source
DOCS_TGT_DIR := docs/build
DOCS_SRC := $(shell find $(DOCS_SRC_DIR)/ -name '*.md')
DOCS_TGT := ${DOCS_SRC:$(DOCS_SRC_DIR)/%.md=$(DOCS_TGT_DIR)/%.js}


# -- [ COMPILATION ] ---------------------------------------------------
$(DOCS_TGT_DIR)/%.js: $(DOCS_SRC_DIR)/%.md
	mkdir -p $(dir $@)
	node tools/markdown-to-mm.js $< "$@.tmp"
	$(babel) "$@.tmp" --out-file $@
	rm "$@.tmp"

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
	@echo "  test ................... Runs unit tests for the project."
	@echo "  test-documentation ..... Tests the documentation examples in the project."
	@echo "  test-all ............... Runs unit and documentation tests for the project."
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
	DISABLE_MM_COMMENTS=true $(babel) src --source-map inline --out-dir .

compile-annotated:
	$(babel) src --source-map inline --out-dir annotated

compile-test:
	$(babel) test/specs-src --source-map inline --out-dir test/specs
	$(babel) test/helpers-src --source-map inline --out-dir test/helpers
	$(browserify) test/browser/browser-tests.js --source-map inline > test/browser/tests.js

compile-documentation: $(DOCS_TGT)

clean:
	rm -rf core helpers data test/specs test/helpers index.js docs/build annotated

_prepare-test: clean compile compile-annotated compile-test

test: _prepare-test
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd test/specs

test-all: _prepare-test compile-documentation
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd test/specs

test-minimal:
	FOLKTALE_ASSERTIONS=none $(mocha) --require babel-polyfill --reporter dot --ui bdd test/specs

test-documentation: _prepare-test compile-documentation
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd --grep "documentation examples" test/specs

test-browser: _prepare-test
	$(karma) start test/karma-local.js

test-sauce: _prepare-test
	$(karma) start test/karma-sauce.js

all-tests:
	$(MAKE) test-all
	$(karma) start test/karma-local.js

documentation: compile-annotated compile-documentation
	node tools/generate-docs.js en

lint:
	$(eslint) src/


.PHONY: help bundle compile compile-test compile-annotated compile-documentation clean test lint documentation test-minimal test-documentation test-browser test-sauce all-tests _prepare-test
